export const INVALID_TOKEN = 'invalid token';
export const BAD_REQUEST = 'bad request';

function isAuthenticationError(error) {
  const message = 'Missing or invalid authentication token';
  return error.code === 'E_UNAUTHORIZED' && error.message === message;
}

function hasFilterByIp(error) {
  const { data } = error.data;
  const ipFilter =
    isAuthenticationError(error) &&
    data &&
    data.err &&
    data.err === 'ip is unauthorized';
  return ipFilter;
}

export function getParameterFromUrl(parameterName) {
  const url = new window.URL(window.location.href);
  return url.searchParams.get(parameterName);
}

function getTokenFromUrl() {
  return getParameterFromUrl('token');
}

function isBadRequestError(error) {
  return error && error.code === 'E_BAD_REQUEST';
}

class VisualiveApiClient {
  constructor(visualiveEnv) {
    this.apiHostUrl = (() => {
      switch (visualiveEnv) {
        case 'development':
          return 'http://localhost:7070/api/v1/';
        case 'stage':
        case 'local_stage':
          return 'https://apistage.visualive.io/api/v1/';
        case 'production':
          return 'https://api.visualive.io/api/v1/';
        default:
          console.warn(`Unrecognized visualiveEnv '${visualiveEnv}'`);
      }
    })();
  }

  doRequest(url, method, data, contentType) {
    const urlFullPath = this.apiHostUrl + url;
    const token = getTokenFromUrl() || localStorage.getItem('api-token');
    const headers = new Headers();
    headers.append('Content-Type', contentType);
    headers.append('x-access-token', token);
    const requestParams = {
      method,
      headers,
      body: data,
      mode: 'cors',
      cache: 'default',
    };
    const request = new window.Request(urlFullPath, requestParams);
    return window
      .fetch(request)
      .then(response => {
        if (response.status > 499) {
          return Promise.reject(response.json());
        }
        return response.json();
      })
      .then(result => {
        if (hasFilterByIp(result)) {
          return Promise.reject(result.data.err);
        }
        if (isAuthenticationError(result)) {
          const error = { error: INVALID_TOKEN };
          return Promise.reject(error);
        }
        if (isBadRequestError(result)) {
          const error = {
            error: BAD_REQUEST,
            message: result.data || result.message,
          };
          return Promise.reject(error);
        }
        return result.data;
      });
  }

  doRequestJson(url, method, data) {
    return this.doRequest(url, method, data, 'application/json');
  }

  getRequest(url) {
    return this.doRequestJson(url, 'GET');
  }

  getCurrentUser() {
    const url = `users/me`;
    return this.getRequest(url);
  }

  getProjectData(projectId, versionId) {
    const url = `project/version?projectId=${projectId}&versionId=${
      versionId ? versionId : 'lastest'
    }`;
    return this.getRequest(url);
  }

  getProjectResourcesRecursive(projectId, versionId, collectedProjects = []) {
    if (collectedProjects.indexOf(projectId) != -1) {
      return Promise.resolve(undefined);
    }
    return new Promise((resolve, reject) => {
      collectedProjects.push(projectId);
      this.getProjectData(projectId).then(data => {
          console.log(projectId, data);
          let resources = data.filesPlain;
          if (data.dependencies.length == 0) {
            resolve(resources);
            return;
          }
          const deps = [];
          for (let depId of data.dependencies) {
            deps.push(
              this.getProjectResourcesRecursive(
                depId,
                undefined,
                collectedProjects
              )
            );
          }
          const allDeps = Promise.all(deps)
            .then(depsResources => {
              for (let depResources of depsResources) {
                if (!depResources) continue;
                resources = Object.assign(depResources, resources);
              }

              resolve(resources);
            })
            .catch(() => {
              console.error(
                'Error while loading project depdendencies:',
                projectId
              );
              reject('Unable to collect deps');
            });
        })
        .catch(e => {
          console.error('Error while loading project:', projectId, e);
        });
    });
  }
}

export default VisualiveApiClient;

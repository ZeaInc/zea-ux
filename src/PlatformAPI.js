

import getSettings from './config/settings.js';

const { HOST_URL } = getSettings();
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

function doRequest(url, method, data, contentType) {
  const urlFullPath = HOST_URL + url;
  const token = getTokenFromUrl();
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

function doRequestJson(url, method, data) {
  return doRequest(url, method, data, 'application/json');
}

export function getRequest(url) {
  return doRequestJson(url, 'GET');
}

export const getProjectData = (projectId, versionId) => {
  const url = `project/version?projectId=${projectId}&versionId=${versionId ? versionId : 'lastest'}`;
  return getRequest(url);
};

export const getProjectResourcesRecursive = (projectId, versionId, collectedProjects=[]) => {
  if(collectedProjects.indexOf(projectId) != -1) {
    return Promise.resolve(undefined);
  }
  return new Promise(function(resolve, reject) {
    collectedProjects.push(projectId)
    const res = getProjectData(projectId)
    res.then(data => {
      console.log(projectId, data);
      let resources = data.filesPlain;
      if(data.dependencies.length == 0) {
        resolve(resources);
        return;
      }
      const deps = [];
      for(let depId of data.dependencies){
        deps.push(getProjectResourcesRecursive(depId, undefined, collectedProjects));
      }
      const allDeps = Promise.all(deps).then((depsResources) =>{
        for(let depResources of depsResources) {
          if(!depResources)
            continue;
          resources = Object.assign(depResources, resources)
        }

        resolve(resources);
      })
      .catch(()=>{
        console.error('Error while loading project depdendencies:', projectId);
        reject("Unable to collect deps")
      });
    })
    .catch((e) => {
      console.error('Error while loading project:', projectId, e);
    });
  });
};

export const getCurrentUser = () => {
  const url = `users/me`;
  return getRequest(url);
};

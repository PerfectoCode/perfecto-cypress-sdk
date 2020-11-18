import path from 'path';
import perfectoCypress from '../src';

// console.log('__dirname', __dirname);
process.chdir(__dirname);
const credentials = {
  // cloud: 'reporting-staging',
  // securityToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxNjdjOTI0OC02YWFiLTQxODUtOWMzYi1hZTQ2NjU3NTQ3ODkifQ.eyJqdGkiOiIwMzZjZWI3NS1lNjAzLTRjYTgtYjQ5ZC1lNDNjYmE5ZGQ3NjYiLCJleHAiOjAsIm5iZiI6MCwiaWF0IjoxNjAyMTc1NDA2LCJpc3MiOiJodHRwczovL2F1dGgucGVyZmVjdG9tb2JpbGUuY29tL2F1dGgvcmVhbG1zL3JlcG9ydGluZy1zdGFnaW5nLXBlcmZlY3RvbW9iaWxlLWNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0aC5wZXJmZWN0b21vYmlsZS5jb20vYXV0aC9yZWFsbXMvcmVwb3J0aW5nLXN0YWdpbmctcGVyZmVjdG9tb2JpbGUtY29tIiwic3ViIjoiMTExOWQ5N2EtNmU5My00ZGNkLTgwNTQtYmI3MmYxZjY0YzljIiwidHlwIjoiT2ZmbGluZSIsImF6cCI6Im9mZmxpbmUtdG9rZW4tZ2VuZXJhdG9yIiwibm9uY2UiOiI2ZTYxNWYyNy01Nzg0LTRiNmEtOGY0Zi03OTU2NGRkMmU1OWUiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIwOGIxNDU5Ny01NTIwLTRiM2YtODcxMS1jMDQwOWRlNDA1OTciLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZXBvcnRpdW0iOnsicm9sZXMiOlsiYWRtaW5pc3RyYXRvciIsInJuZF9hZG1pbiIsInJlcG9ydF9hZG1pbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MifQ.dxECjiWd-KI8wR-lM2QYedLqGQ1J4mtKiTwakFDyBvM'
  cloud: 'covid19',
  securityToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxZmY2NTFlYy1mZjZiLTQ2OGItOWUzNS1iZGU1MzFhMzE4MDQifQ.eyJqdGkiOiIxZjZhMzViZC05NDcwLTQ1MGMtYWM4NS02MzRlZjU3OTdkMGMiLCJleHAiOjAsIm5iZiI6MCwiaWF0IjoxNjA1NTMyODcxLCJpc3MiOiJodHRwczovL2F1dGgyLnBlcmZlY3RvbW9iaWxlLmNvbS9hdXRoL3JlYWxtcy9jb3ZpZDE5LXBlcmZlY3RvbW9iaWxlLWNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0aDIucGVyZmVjdG9tb2JpbGUuY29tL2F1dGgvcmVhbG1zL2NvdmlkMTktcGVyZmVjdG9tb2JpbGUtY29tIiwic3ViIjoiYjViYTViZjctOTY2Ny00NDQzLTkwZDgtNjczMzYyN2YxMDk0IiwidHlwIjoiT2ZmbGluZSIsImF6cCI6Im9mZmxpbmUtdG9rZW4tZ2VuZXJhdG9yIiwibm9uY2UiOiJiZjZlMzhmNC1lYTJjLTRjYTEtOGU5NS04YjcyMmRlYjMyYWIiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIwYjliYjg1ZC02YzNiLTQwZjctYmNhYy0yYWYzY2FmMmY0MzEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUgb2ZmbGluZV9hY2Nlc3MifQ.CZOjpVGwKTPVl2wqmmpEMez2Ij_ItGL9ywTX7AP4Cwg'
  // cloud: 'demo',
  // securityToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI4YmI4YmZmZS1kMzBjLTQ2MjctYmMxMS0zNTYyMmY1ZDkyMGYifQ.eyJqdGkiOiIzNzIwODVjNy01MWFjLTQxYjQtYmY5OS03OTk0MTFjNWM3MDkiLCJleHAiOjAsIm5iZiI6MCwiaWF0IjoxNjAyNDk4NDI2LCJpc3MiOiJodHRwczovL2F1dGgucGVyZmVjdG9tb2JpbGUuY29tL2F1dGgvcmVhbG1zL2RlbW8tcGVyZmVjdG9tb2JpbGUtY29tIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLnBlcmZlY3RvbW9iaWxlLmNvbS9hdXRoL3JlYWxtcy9kZW1vLXBlcmZlY3RvbW9iaWxlLWNvbSIsInN1YiI6IjdmOTRiYTZhLWY5MTktNDMwMi1hYjQ3LTY2NGI3MDk5Y2Q3MyIsInR5cCI6Ik9mZmxpbmUiLCJhenAiOiJvZmZsaW5lLXRva2VuLWdlbmVyYXRvciIsIm5vbmNlIjoiYzY3OTU0ZGEtOTlhYy00NWFlLTllYWUtMzg4NTQ3ZDlkZDIwIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYWI1MzU2MTUtMzhlOC00M2M0LTg3NjUtNDMyOWMzMTBhYTM0IiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZXBvcnRpdW0iOnsicm9sZXMiOlsicm5kX2FkbWluIiwicmVwb3J0X2FkbWluIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.Vbf-5bLbVuGtflDiDEVZsZdIkstmnrlsJpKFZWql17Y'
  // cloud: 'scouter',
  // securityToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1OTI0ZWY2Zi0zMjhjLTQ5YjAtOTkzMy03MmFjZDViMzcyMGMifQ.eyJqdGkiOiJlOGQ1YTU1MC00YzhjLTQyODUtOTAxYS02YTI3ZTNkYTJkNGMiLCJleHAiOjAsIm5iZiI6MCwiaWF0IjoxNTk4MjA5NDI4LCJpc3MiOiJodHRwczovL2F1dGgucGVyZmVjdG9tb2JpbGUuY29tL2F1dGgvcmVhbG1zL3Njb3V0ZXItcGVyZmVjdG9tb2JpbGUtY29tIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLnBlcmZlY3RvbW9iaWxlLmNvbS9hdXRoL3JlYWxtcy9zY291dGVyLXBlcmZlY3RvbW9iaWxlLWNvbSIsInN1YiI6ImI5NDU5NmVlLTg3YTQtNGZjMy04MWE4LWNhODhhNDM5Y2RjZiIsInR5cCI6Ik9mZmxpbmUiLCJhenAiOiJvZmZsaW5lLXRva2VuLWdlbmVyYXRvciIsIm5vbmNlIjoiNTI3MjFhNzQtNmRlYi00OTRkLTgyZjAtYTMxMzQ1MDI3NTI0IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiN2VmMzY5ZmYtYTRlMC00MGNkLTljMmYtZjc4MDY4MGNhMWVmIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZXBvcnRpdW0iOnsicm9sZXMiOlsicm5kX2FkbWluIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyJ9.wDTdbh1bP5eOL2p-ITV1G6rjEgyWiX5RyXYWdpSdKL0'
  // cloud: 'web-staging',
  // securityToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlZGU1ZTc5Yy04Yzc1LTQxYjgtODZiMC1jZTRiMjE4OTFkNjEifQ.eyJqdGkiOiI3ZTFjYWU5YS0xZTc4LTQ5ODQtOWY4ZC03YzAzM2MwNDllZjMiLCJleHAiOjAsIm5iZiI6MCwiaWF0IjoxNjAzMjg0OTE0LCJpc3MiOiJodHRwczovL2F1dGgucGVyZmVjdG9tb2JpbGUuY29tL2F1dGgvcmVhbG1zL3dlYi1zdGFnaW5nLXBlcmZlY3RvbW9iaWxlLWNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0aC5wZXJmZWN0b21vYmlsZS5jb20vYXV0aC9yZWFsbXMvd2ViLXN0YWdpbmctcGVyZmVjdG9tb2JpbGUtY29tIiwic3ViIjoiNzgxMjNjNTktZmVhMS00MjQxLThlZWMtOTBjZmNmNmE4NTdiIiwidHlwIjoiT2ZmbGluZSIsImF6cCI6Im9mZmxpbmUtdG9rZW4tZ2VuZXJhdG9yIiwibm9uY2UiOiIyYmIxOWNjNC0yZGMzLTQzZDgtYTVhZi02ODExM2U4M2YyYTgiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIxMWY5ZjdhMC02YTFjLTQ3MjgtODE1MS0zY2JkNjE2OGM0MjAiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIn0._b9reShSNMM8ChaL9faRHpk6WTIfR83Ab8ZE6JqIGsg'
  // cloud: 'web-demo',
  // securityToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI2YzlkOTBjZS1mZDIxLTQwYWYtYWY4Yi1iMTU0ODNmY2VmM2EifQ.eyJqdGkiOiJlZTg2MTE4NS1mNWY1LTRiNGEtODVkZi01MGEzY2VhOWNhNzUiLCJleHAiOjAsIm5iZiI6MCwiaWF0IjoxNjAyMTUyNjY4LCJpc3MiOiJodHRwczovL2F1dGgucGVyZmVjdG9tb2JpbGUuY29tL2F1dGgvcmVhbG1zL3dlYi1kZW1vLXBlcmZlY3RvbW9iaWxlLWNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0aC5wZXJmZWN0b21vYmlsZS5jb20vYXV0aC9yZWFsbXMvd2ViLWRlbW8tcGVyZmVjdG9tb2JpbGUtY29tIiwic3ViIjoiZWE0Njc3ZDQtMzI3MS00MDcyLWI1ZGYtNDRiYjVjZTdhMDM3IiwidHlwIjoiT2ZmbGluZSIsImF6cCI6Im9mZmxpbmUtdG9rZW4tZ2VuZXJhdG9yIiwibm9uY2UiOiIwN2UzZWZjNy0xMzk5LTQ4YmYtOWM1Zi0xMWUwMWVjMTYwM2IiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJiNjIyODk1NC0wMzAxLTQ1NTctYTYxOS1mYzJiNzYxMjcyOWUiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIn0.yTBJbpv67XvSApCsszIkqO8hu0prOire3wFcpiN7vnY'
};

perfectoCypress.withConfigFile(path.resolve(__dirname, 'perfecto-config.json'));
perfectoCypress.run({credentials}).then(res => console.log(res)).catch(e => console.log(e));

const getters = {
  theme: state => state.settings.theme,
  token: state => state.user.token,
  id: state => state.user.id,
  code: state => state.user.code,
  name: state => state.user.name,
  avatar: state => state.user.userAttribute.image,
  roles: state => state.user.roles,
  jobs: state => state.user.jobs,
  orgs: state => state.user.orgs,
  primaryOrg: state => state.user.primaryOrg,
  qualifications: state => state.user.qualifications,
  userAttribute: state => state.user.userAttribute,
  permission_funcs: state => state.user.funcPermissions,
  permission_routes: state => state.permission.routes,
  hazardId: state => state.settings.hazardId,
  cachedView: state => state.settings.cachedView
}
export default getters

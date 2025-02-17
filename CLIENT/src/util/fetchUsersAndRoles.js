export const fetchUsersAndRoles = async (axiosPrivate, filters) => {

  try {
    const [usersResponse, rolesResponse] = await Promise.all([
      axiosPrivate.get(`/users/`, { params: filters }),
      axiosPrivate.get(`/roles/`)
    ]);

    return {
      users: usersResponse.data,
      roles: rolesResponse.data
    };
  } catch (err) {
    throw new Error(`Failed to fetch data: ${err.response ? err.response.data.message : err.message}`);
  }
};

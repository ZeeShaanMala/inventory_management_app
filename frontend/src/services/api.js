import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://172.20.10.2:5000/api";
const getAuthHeaders = async () => {

  const token = await AsyncStorage.getItem(
    "token"
  );

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

};

export const api = {

  // ================= LOGIN =================
  login: async ({ email, password }) => {

    const response = await fetch(
      `${BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Login failed"
      );
    }

    return data;

  },


  // ================= REGISTER =================
  register: async ({
    name,
    email,
    password
  }) => {

    const response = await fetch(
      `${BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Registration failed"
      );
    }

    return data;

  },

  // ================= UPDATE PROFILE =================
updateProfile: async (payload) => {

  const response = await fetch(
    `${BASE_URL}/auth/update-profile`,
    {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.message || "Profile update failed"
    );

  }

  return data;

},

// ================= CHANGE PASSWORD =================
changePassword: async (payload) => {

  const response = await fetch(
    `${BASE_URL}/auth/change-password`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.message || "Password update failed"
    );

  }

  return data;

},

  // ================= GET DEVICES =================
  getDevices: async () => {

    const response = await fetch(
  `${BASE_URL}/devices`,
  {
    headers: await getAuthHeaders()
  }
);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch devices"
      );
    }

    return data.data;

  },


  // ================= ADD DEVICE =================
  addDevice: async (device) => {

    const response = await fetch(
      `${BASE_URL}/devices`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(device)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to add device"
      );
    }

    return data;

  },


  // ================= UPDATE DEVICE =================
  updateDevice: async (
    imei,
    updates
  ) => {

    const response = await fetch(
      `${BASE_URL}/devices/${imei}`,
      {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify(updates)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update device"
      );
    }

    return data;

  },


  // ================= DELETE DEVICE =================
  deleteDevice: async (imei) => {

    const response = await fetch(
      `${BASE_URL}/devices/${imei}`,
      {
  method: "DELETE",
  headers: await getAuthHeaders()
}
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete device"
      );
    }

    return data;

  },


  // ================= ASSIGN DEVICE =================
  assignDevice: async (
    imei,
    partyId
  ) => {

    const response = await fetch(
      `${BASE_URL}/devices/assign/${imei}`,
      {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          partyId
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Assignment failed"
      );
    }

    return data;

  },


  // ================= ACTIVATE DEVICE =================
  activateDevice: async (
    imei,
    payload
  ) => {

    const response = await fetch(
      `${BASE_URL}/devices/activate/${imei}`,
      {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Activation failed"
      );
    }

    return data;

  },


  // ================= RETURN DEVICE =================
  returnDevice: async (imei) => {

    const response = await fetch(
      `${BASE_URL}/devices/return/${imei}`,
      {
  method: "PUT",
  headers: await getAuthHeaders()
}
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Return failed"
      );
    }

    return data;

  },


  // ================= SELL DEVICE =================
  sellDevice: async (
    imei,
    payload
  ) => {

    const response = await fetch(
      `${BASE_URL}/devices/sell/${imei}`,
      {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Sale failed"
      );
    }

    return data;

  },

  // ================= GET PARTIES =================
getParties: async () => {

  const response = await fetch(
  `${BASE_URL}/parties`,
  {
    headers: await getAuthHeaders()
  }
);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch parties"
    );
  }

  return data.data;

},


// ================= ADD PARTY =================
addParty: async (party) => {

  const response = await fetch(
    `${BASE_URL}/parties`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(party)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add party"
    );
  }

  return data;

},


// ================= DELETE PARTY =================
deleteParty: async (id) => {

  const response = await fetch(
    `${BASE_URL}/parties/${id}`,
    {
  method: "DELETE",
  headers: await getAuthHeaders()
}
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete party"
    );
  }

  return data;

},


// ================= GET HISTORY =================
getHistory: async () => {

  const response = await fetch(
  `${BASE_URL}/history`,
  {
    headers: await getAuthHeaders()
  }
);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch history"
    );
  }

  return data.data;

},


// ================= GET DEVICE HISTORY =================
getDeviceHistory: async (imei) => {

  const response = await fetch(
  `${BASE_URL}/history/${imei}`,
  {
    headers: await getAuthHeaders()
  }
);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch device history"
    );
  }

  return data.data;

}

};
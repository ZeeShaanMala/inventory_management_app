import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "services/api";




export const useStore = create((set, get) => ({

  // ================= STATE =================
  devices: [],
  parties: [],
  user: null,
  token: null,

  // 🔥 GLOBAL HISTORY (FIXED)
  history: [],

  settings: {
    notifications: true,
    emailReports: false,
    twoFactor: false,
    language: "English"
  },

  // ================= HISTORY =================
addHistory: async () => {},

// ================= CLEAR HISTORY =================
clearHistory: () => {

  set({ history: [] });

  AsyncStorage.removeItem("history");
},

// ================= DELETE SINGLE HISTORY =================
deleteHistoryItem: (id) => {

  const updated = get().history.filter(
    (item) => item.id !== id
  );

  set({ history: updated });

  get().saveHistory(updated);
},

// ================= LOAD =================
loadData: async () => {

  try {

    // ================= LOCAL STORAGE =================
    const u = await AsyncStorage.getItem("user");
    const t = await AsyncStorage.getItem("token");
    const s = await AsyncStorage.getItem("settings");


// ================= LOCAL USER =================
    if (u && t) {

  set({
    user: JSON.parse(u),
    token: t
  });

}

    // ================= BACKEND DATA =================
    const devices = await api.getDevices();

    const parties = await api.getParties();

    const history = await api.getHistory();


    // ================= SET STATE =================
    set({
      devices,
      parties,
      history
    });


    


    // ================= LOCAL SETTINGS =================
    if (s) {
      set({ settings: JSON.parse(s) });
    }

  } catch (error) {

    console.log(
      "LOAD DATA ERROR:",
      error.message
    );

  }

},

  // ================= SAVE =================
  saveDevices: async() => {},
  saveParties: async() => {},
  saveHistory: async() => {},

  saveUser: (user) =>
    user
      ? AsyncStorage.setItem("user", JSON.stringify(user))
      : AsyncStorage.removeItem("user"),

  saveSettings: (settings) =>
    AsyncStorage.setItem("settings", JSON.stringify(settings)),
  

 // ================= AUTH =================
login: async (
  email,
  password
) => {

  try {

    // ================= BACKEND LOGIN =================
    const data = await api.login({
      email,
      password
    });


    // ================= USER =================
    const user = data.user;

const token = data.token;


// ================= SAVE =================
set({
  user,
  token
});


// ================= PERSIST =================
get().saveUser(user);

AsyncStorage.setItem(
  "token",
  token
);


    return data;

  } catch (error) {

    throw new Error(
      error.message || "Login failed"
    );

  }

},
  logout: async () => {

  set({
    user: null,
    token: null
  });

  get().saveUser(null);

  await AsyncStorage.removeItem(
    "token"
  );

},

  updateUser: async (updates) => {

  try {

    // ================= CURRENT USER =================
    const currentUser = get().user;

    // ================= BACKEND UPDATE =================
    const data = await api.updateProfile({
      id: currentUser.id,
      name: updates.name,
      email: updates.email,
      avatar: updates.avatar || currentUser.avatar
    });

    // ================= UPDATED USER =================
    const updatedUser = data.user;

    // ================= UPDATE STATE =================
    set({
      user: updatedUser
    });

    // ================= SAVE LOCAL =================
    get().saveUser(updatedUser);

  } catch (error) {

    throw new Error(
      error.message || "Profile update failed"
    );

  }

},

  changePassword: async (
  currentPassword,
  newPassword
) => {

  try {

    const currentUser = get().user;

    // ================= BACKEND REQUEST =================
    await api.changePassword({
      email: currentUser.email,
      currentPassword,
      newPassword
    });

  } catch (error) {

    throw new Error(
      error.message || "Password update failed"
    );

  }

},
  // ================= SETTINGS =================
  toggleNotifications: () => {
    const updated = {
      ...get().settings,
      notifications: !get().settings.notifications
    };
    set({ settings: updated });
    get().saveSettings(updated);
  },

  toggleEmailReports: () => {

  const updated = {
    ...get().settings,
    emailReports:
      !get().settings.emailReports
  };

  set({
    settings: updated
  });

  get().saveSettings(updated);

},
toggleTwoFactor: () => {

  const updated = {
    ...get().settings,
    twoFactor:
      !get().settings.twoFactor
  };

  set({
    settings: updated
  });

  get().saveSettings(updated);

},

  // ================= DEVICE =================
addDevice: async (device) => {

  try {

    // ================= BACKEND REQUEST =================
    await api.addDevice(device);


    // ================= REFRESH DEVICES =================
    const devices = await api.getDevices();

    const history = await api.getHistory();


    // ================= UPDATE STATE =================
    set({
      devices,
      history
    });

  } catch (error) {

    throw new Error(
      error.message || "Failed to add device"
    );

  }

},

  addDevicesBulk: async () => {
  throw new Error(
    "Bulk add not migrated yet"
  );
},

  // ================= DELETE DEVICE =================
deleteDevice: async (imei) => {

  try {

    // ================= BACKEND DELETE =================
    await api.deleteDevice(imei);


    // ================= REFRESH DATA =================
    const devices = await api.getDevices();

    const history = await api.getHistory();


    // ================= UPDATE STATE =================
    set({
      devices,
      history
    });

  } catch (error) {

    throw new Error(
      error.message || "Failed to delete device"
    );

  }

},
  // ================= UPDATE DEVICE =================
updateDevice: async (
  imei,
  updates
) => {

  try {

    // ================= BACKEND UPDATE =================
    await api.updateDevice(
      imei,
      updates
    );


    // ================= REFRESH DATA =================
    const devices = await api.getDevices();

    const history = await api.getHistory();


    // ================= UPDATE STATE =================
    set({
      devices,
      history
    });

  } catch (error) {

    throw new Error(
      error.message || "Failed to update device"
    );

  }

},

  // ================= ASSIGN =================
assignDevice: async (
  imei,
  partyId
) => {

  try {

    // ================= BACKEND ASSIGN =================
    await api.assignDevice(
      imei,
      partyId
    );


    // ================= REFRESH DATA =================
    const devices = await api.getDevices();

    const history = await api.getHistory();


    // ================= UPDATE STATE =================
    set({
      devices,
      history
    });

  } catch (error) {

    throw new Error(
      error.message || "Assignment failed"
    );

  }

},
  // ================= UNASSIGN =================
unassignDevice: async () => {
  throw new Error(
    "Unassign not migrated yet"
  );
},

  // ================= BULK ASSIGN =================
  assignDevices: async () => {
  throw new Error(
    "Bulk assign not migrated yet"
  );
},

  // ================= ACTIVATE =================
activateDevice: async (
  imei,
  data
) => {

  try {

    // ================= BACKEND ACTIVATE =================
    await api.activateDevice(
      imei,
      data
    );


    // ================= REFRESH DATA =================
    const devices = await api.getDevices();

    const history = await api.getHistory();


    // ================= UPDATE STATE =================
    set({
      devices,
      history
    });

  } catch (error) {

    throw new Error(
      error.message || "Activation failed"
    );

  }

},

  // ================= RETURN =================
returnDevice: async (imei) => {

  try {

    // ================= BACKEND RETURN =================
    await api.returnDevice(imei);


    // ================= REFRESH DATA =================
    const devices = await api.getDevices();

    const history = await api.getHistory();


    // ================= UPDATE STATE =================
    set({
      devices,
      history
    });

  } catch (error) {

    throw new Error(
      error.message || "Return failed"
    );

  }

},

  // ================= PARTY =================
addParty: async (party) => {

  try {

    // ================= BACKEND ADD =================
    await api.addParty(party);


    // ================= REFRESH PARTIES =================
    const parties = await api.getParties();


    // ================= UPDATE STATE =================
    set({
      parties
    });

  } catch (error) {

    throw new Error(
      error.message || "Failed to add party"
    );

  }

},

 // ================= DELETE PARTY =================
deleteParty: async (id) => {

  try {

    // ================= BACKEND DELETE =================
    await api.deleteParty(id);


    // ================= REFRESH PARTIES =================
    const parties = await api.getParties();


    // ================= UPDATE STATE =================
    set({
      parties
    });

  } catch (error) {

    throw new Error(
      error.message || "Failed to delete party"
    );

  }

},
   // ================= MARK SOLD =================
markAsSold: async (
  imei,
  data
) => {

  try {

    // ================= BACKEND SALE =================
    await api.sellDevice(
      imei,
      data
    );


    // ================= REFRESH DATA =================
    const devices = await api.getDevices();

    const history = await api.getHistory();


    // ================= UPDATE STATE =================
    set({
      devices,
      history
    });

  } catch (error) {

    throw new Error(
      error.message || "Sale failed"
    );

  }

},

// ================= RESTORE DEVICE =================
restoreDevice: async () => {
  throw new Error(
    "Restore not migrated yet"
  );
},
}));
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STATUS } from "@utils/constants";

const normalizeIMEI = (imei) => imei?.toString().trim();

const createHistoryEntry = (action, label, note = "") => ({
  id: Date.now().toString(),
  action,
  label,
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString(),
  note,
  by: "Admin"
});

export const useStore = create((set, get) => ({

  // ================= STATE =================
  devices: [],
  parties: [],
  user: null,

  // 🔥 GLOBAL HISTORY (FIXED)
  history: [],

  settings: {
    notifications: true,
    emailReports: false,
    twoFactor: false,
    language: "English"
  },

  // ================= HISTORY =================
  addHistory: (entry) => {
    const updated = [entry, ...(get().history || [])];
    set({ history: updated });
  },

  // ================= LOAD =================
  loadData: async () => {
    const d = await AsyncStorage.getItem("devices");
    const p = await AsyncStorage.getItem("parties");
    const u = await AsyncStorage.getItem("user");
    const s = await AsyncStorage.getItem("settings");

    if (d) set({ devices: JSON.parse(d) });
    if (p) set({ parties: JSON.parse(p) });
    if (u) set({ user: JSON.parse(u) });
    if (s) set({ settings: JSON.parse(s) });
  },

  // ================= SAVE =================
  saveDevices: (devices) =>
    AsyncStorage.setItem("devices", JSON.stringify(devices)),

  saveParties: (parties) =>
    AsyncStorage.setItem("parties", JSON.stringify(parties)),

  saveUser: (user) =>
    user
      ? AsyncStorage.setItem("user", JSON.stringify(user))
      : AsyncStorage.removeItem("user"),

  saveSettings: (settings) =>
    AsyncStorage.setItem("settings", JSON.stringify(settings)),

  // ================= AUTH =================
  login: (email) => {
    const user = { email };
    set({ user });
    get().saveUser(user);
  },

  logout: () => {
    set({ user: null });
    get().saveUser(null);
  },

  updateUser: (updates) => {
    const updated = { ...get().user, ...updates };
    set({ user: updated });
    get().saveUser(updated);
  },

  changePassword: (password) => {
    const updated = { ...get().user, password };
    set({ user: updated });
    get().saveUser(updated);
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

  // ================= DEVICE =================
  addDevice: (device) => {
    const newIMEI = normalizeIMEI(device.imei);

    if (get().devices.some((d) => normalizeIMEI(d.imei) === newIMEI)) {
      throw new Error("Device already exists");
    }

    const entry = createHistoryEntry(
      "created",
      "Device Added",
      `IMEI: ${newIMEI}`
    );

    get().addHistory(entry);

    const newDevice = {
  ...device,
  imei: newIMEI,
  status: STATUS.IN_STOCK,
  assignedTo: null,
  createdAt: new Date().toISOString(), // 🔥 ADD THIS
  history: [entry]
};

    const updated = [...get().devices, newDevice];
    set({ devices: updated });
    get().saveDevices(updated);
  },

  addDevicesBulk: (startImei, quantity) => {
  const devices = get().devices;

  const newDevices = [];

  for (let i = 0; i < quantity; i++) {
    const imei = (Number(startImei) + i).toString();

    // ✅ prevent duplicate IMEI
    if (devices.some(d => d.imei === imei)) {
      continue;
    }

    const entry = createHistoryEntry(
      "created",
      "Bulk Device Added",
      `IMEI: ${imei}`
    );

    newDevices.push({
      imei,
      status: STATUS.IN_STOCK,
      assignedTo: null,
      history: [entry]
    });

    get().addHistory(entry);
  }

  const updated = [...devices, ...newDevices];

  set({ devices: updated });
  get().saveDevices(updated);
},

  deleteDevice: (imei) => {
    const updated = get().devices.filter((d) => d.imei !== imei);
    set({ devices: updated });
    get().saveDevices(updated);
  },

  updateDevice: (imei, updates) => {
    const updated = get().devices.map((d) =>
      d.imei === imei ? { ...d, ...updates } : d
    );
    set({ devices: updated });
    get().saveDevices(updated);
  },

  // ================= ASSIGN =================
  assignDevice: (imei, partyId) => {
    const entry = createHistoryEntry(
      "assigned",
      "Device Assigned",
      `Assigned to party: ${partyId}`
    );

    get().addHistory(entry);

    const updated = get().devices.map((d) =>
      d.imei === imei
        ? {
            ...d,
            status: STATUS.ASSIGNED,
            assignedTo: partyId,
            history: [...(d.history || []), entry]
          }
        : d
    );

    set({ devices: updated });
    get().saveDevices(updated);
  },

  // ================= UNASSIGN =================
  // ================= UNASSIGN =================
unassignDevice: (imei) => {
  const entry = createHistoryEntry(
    "unassigned",
    "Device Unassigned",
    "Returned to stock before activation"
  );

  get().addHistory(entry);

  const updated = get().devices.map((d) =>
    d.imei === imei
      ? {
          ...d,
          status: STATUS.IN_STOCK,
          assignedTo: null,
          history: [...(d.history || []), entry]
        }
      : d
  );

  set({ devices: updated });
  get().saveDevices(updated);
},

  // ================= BULK ASSIGN =================
  assignDevices: (partyId, quantity) => {
    const devices = get().devices;

    const available = devices.filter(
      d => d.status === STATUS.IN_STOCK
    );

    if (available.length < quantity) {
      alert("Not enough devices");
      return;
    }

    const selected = available.slice(0, quantity);

    const entry = createHistoryEntry(
      "assigned",
      "Bulk Device Assignment",
      `Assigned ${quantity} devices to party: ${partyId}`
    );

    get().addHistory(entry);

    const updated = devices.map(device => {
      if (selected.some(d => d.imei === device.imei)) {
        return {
          ...device,
          status: STATUS.ASSIGNED,
          assignedTo: partyId,
          history: [...(device.history || []), entry]
        };
      }
      return device;
    });

    set({ devices: updated });
    get().saveDevices(updated);
  },

  // ================= ACTIVATE =================
  activateDevice: (imei, data) => {
    const entry = createHistoryEntry(
      "activated",
      "Device Activated",
      data?.notes || "Activated"
    );

    get().addHistory(entry);

    const updated = get().devices.map((d) =>
      d.imei === imei
        ? {
            ...d,
            status: STATUS.ACTIVATED,
            vehicleNumber: data?.vehicleNumber || null,
            customerName: data?.customerName || null,
            notes: data?.notes || "",
            activatedAt: new Date().toISOString(),
            history: [...(d.history || []), entry]
          }
        : d
    );

    set({ devices: updated });
    get().saveDevices(updated);
  },

  // ================= RETURN =================
  returnDevice: (imei) => {
    const entry = createHistoryEntry(
      "returned",
      "Device Returned",
      "Returned after use"
    );

    get().addHistory(entry);

    const updated = get().devices.map((d) =>
      d.imei === imei
        ? {
            ...d,
            status: STATUS.IN_STOCK,
            assignedTo: null,
            vehicleNumber: null,
            customerName: null,
            activatedAt: null,
            history: [...(d.history || []), entry]
          }
        : d
    );

    set({ devices: updated });
    get().saveDevices(updated);
  },

  // ================= PARTY =================
  addParty: (party) => {
    const updated = [
      ...get().parties,
      { ...party, id: Date.now().toString() }
    ];
    set({ parties: updated });
    get().saveParties(updated);
  },

  deleteParty: (id) => {
    const updated = get().parties.filter((p) => p.id !== id);
    set({ parties: updated });
    get().saveParties(updated);
  },

   // ================= MARK SOLD =================
markAsSold: (imei, data) => {
  const entry = createHistoryEntry(
    "sold",
    "Device Sold",
    `Sold for ₹${data.sellingPrice}`
  );

  get().addHistory(entry);

  const updated = get().devices.map((d) =>
    d.imei === imei
      ? {
          ...d,
          status: STATUS.SOLD,
          assignedTo: null,

          // ✅ REAL ANALYTICS DATA
          soldAt: new Date().toISOString(),
          sellingPrice: data.sellingPrice,
          costPrice: data.costPrice,

          history: [...(d.history || []), entry]
        }
      : d
  );

  set({ devices: updated });
  get().saveDevices(updated);
}
}));
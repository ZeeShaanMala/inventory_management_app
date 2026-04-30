import { useStore } from "@store/useStore";

export const api = {
  // 🔐 LOGIN (mock for now)
  login: async ({ email, password }) => {
    // later → backend call
    return {
      token: "demo_token_123",
      user: { email }
    };
  },

  // 📦 GET DEVICES
  getDevices: async () => {
    const { devices } = useStore.getState();
    return devices;
  },

  // ➕ ADD DEVICE
  addDevice: async (device) => {
    const { addDevice } = useStore.getState();
    return addDevice(device);
  },

  // ✏️ UPDATE DEVICE
  updateDevice: async (imei, updates) => {
    const { updateDevice } = useStore.getState();
    return updateDevice(imei, updates);
  },

  // ❌ DELETE DEVICE
  deleteDevice: async (imei) => {
    const { deleteDevice } = useStore.getState();
    return deleteDevice(imei);
  }
};
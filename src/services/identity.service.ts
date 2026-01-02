export const IdentityService = {
    getDeviceId: (): string => {
        let deviceId = localStorage.getItem('playtolearn_device_id');

        if (!deviceId) {
            deviceId = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('playtolearn_device_id', deviceId);
        }

        return deviceId;
    },

    clearDeviceId: () => {
        localStorage.removeItem('playtolearn_device_id');
    }
};

export const SessionManager = {
    getSessionGame: (host) => {
        return sessionStorage.getItem(`gate_session_${host}`);
    },

    setSessionGame: (host, gameId) => {
        sessionStorage.setItem(`gate_session_${host}`, gameId);
    },

    isAllowed: (host) => {
        return sessionStorage.getItem(`gate_allowed_${host}`) === 'true';
    },

    allowHost: (host) => {
        sessionStorage.setItem(`gate_allowed_${host}`, 'true');
    }
};

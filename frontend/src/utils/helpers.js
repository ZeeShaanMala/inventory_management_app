export const getPartyName = (parties, id) => {
  const party = parties.find(p => p.id === id);
  return party ? party.name : "N/A";
};
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { addressService } from '../services/addressService';
import { extractList, mapAddress } from '../utils/mappers';

const AddressContext = createContext({
  addresses: [],
  defaultAddress: null,
  loading: false,
  error: null,
  refresh: async () => {},
  add: async () => null,
  update: async () => null,
  setDefault: async () => {},
});

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getAddresses();
      const list = extractList(response, 'addresses', 'data').map(mapAddress);
      setAddresses(list);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { refresh(); }, [refresh]);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) || addresses[0] || null,
    [addresses],
  );

  const add = useCallback(async (payload) => {
    const response = await addressService.addAddress(payload);
    await refresh();
    return response;
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    const response = await addressService.updateAddress(id, payload);
    await refresh();
    return response;
  }, [refresh]);

  const setDefault = useCallback(async (id) => {
    const response = await addressService.setDefaultAddress(id);
    // Optimistic update — make sure the UI flips immediately
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    await refresh();
    return response;
  }, [refresh]);

  const value = useMemo(() => ({
    addresses, defaultAddress, loading, error, refresh, add, update, setDefault,
  }), [addresses, defaultAddress, loading, error, refresh, add, update, setDefault]);

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};

export const useAddress = () => useContext(AddressContext);

export default AddressContext;
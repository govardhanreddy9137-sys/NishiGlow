import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_ITEMS, INITIAL_SERVICES } from '../data/siteData';
import { useAuth } from './AuthContext';
import { authApiUrl } from '../authApi';

const StudioDataContext = createContext();
const NEW_PORTFOLIO_POSTERS = INITIAL_PORTFOLIO_ITEMS.filter(
  item => item.id === 'post-4' || item.id === 'post-5'
);
const OLD_STUDIO_VIDEO_URL = '/videos/video_1_nishi.mp4';
const NEW_STUDIO_VIDEO_URL = '/videos/nishiglow-ai.mp4';
const updateStudioVideoUrl = item => ({
  ...item,
  ...(item.videoUrl === OLD_STUDIO_VIDEO_URL ? { videoUrl: NEW_STUDIO_VIDEO_URL } : {}),
  ...(item.sampleVideo === OLD_STUDIO_VIDEO_URL ? { sampleVideo: NEW_STUDIO_VIDEO_URL } : {})
});

const adminApiRequest = async (path, options = {}) => {
  const response = await fetch(authApiUrl(path), {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error('The admin server returned an invalid response.');
  }
  if (!data || !response.ok || !data.success) {
    throw new Error(data?.message || `Admin request failed (HTTP ${response.status}).`);
  }
  return data;
};

const loadServices = () => {
  const saved = localStorage.getItem('ng_services_v7');
  if (saved) {
    const savedServices = JSON.parse(saved);
    return Array.isArray(savedServices) ? savedServices.map(updateStudioVideoUrl) : INITIAL_SERVICES;
  }

  const previous = localStorage.getItem('ng_services_v6');
  if (!previous) return INITIAL_SERVICES;

  const previousServices = JSON.parse(previous);
  if (!Array.isArray(previousServices)) return INITIAL_SERVICES;

  return previousServices.map(service => {
    const updatedService = updateStudioVideoUrl(service);
    return service.id === 'ai-videos'
      ? {
          ...updatedService,
          pricing: INITIAL_SERVICES.find(initialService => initialService.id === 'ai-videos').pricing
        }
      : updatedService;
  });
};

const loadPortfolioItems = () => {
  const saved = localStorage.getItem('ng_portfolio_items_v7');
  if (saved) {
    const savedItems = JSON.parse(saved);
    return Array.isArray(savedItems) ? savedItems.map(updateStudioVideoUrl) : INITIAL_PORTFOLIO_ITEMS;
  }

  const previous = localStorage.getItem('ng_portfolio_items_v6');
  if (!previous) return INITIAL_PORTFOLIO_ITEMS;

  const previousItems = JSON.parse(previous);
  if (!Array.isArray(previousItems)) return INITIAL_PORTFOLIO_ITEMS;

  const newItems = NEW_PORTFOLIO_POSTERS.filter(
    item => !previousItems.some(savedItem => savedItem.id === item.id)
  );
  return [...newItems, ...previousItems.map(updateStudioVideoUrl)];
};

const INITIAL_ORDERS = [
  {
    id: 'ORD-9821A',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    service: 'Poster Designing',
    plan: 'Premium Event Poster',
    amount: 149,
    status: 'Completed',
    date: '2026-03-28',
    paymentMethod: 'UPI'
  },
  {
    id: 'ORD-8412B',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.s@example.com',
    service: 'AI Advertisement Videos',
    plan: 'Cinematic Reel Package',
    amount: 599,
    status: 'In Progress',
    date: '2026-03-29',
    paymentMethod: 'UPI'
  },
  {
    id: 'ORD-7634C',
    customerName: 'Vikram Joshi',
    customerEmail: 'v.joshi@startup.io',
    service: 'Logo Designing',
    plan: 'Brand Identity Suite',
    amount: 299,
    status: 'Completed',
    date: '2026-03-25',
    paymentMethod: 'UPI'
  }
];

export const StudioDataProvider = ({ children }) => {
  const { isAdmin, authReady } = useAuth();
  // 1. Portfolio items (Persisted in localStorage with fresh reset check)
  const [portfolioItems, setPortfolioItems] = useState(() => {
    try {
      return loadPortfolioItems();
    } catch {
      return INITIAL_PORTFOLIO_ITEMS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ng_orders_v7');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // 3. Services List (Persisted in localStorage)
  const [services, setServices] = useState(() => {
    try {
      return loadServices();
    } catch {
      return INITIAL_SERVICES;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ng_portfolio_items_v7', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  useEffect(() => {
    localStorage.setItem('ng_orders_v7', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (!authReady || !isAdmin) return;
    let cancelled = false;
    adminApiRequest('/api/admin/orders')
      .then(({ orders: serverOrders }) => {
        if (!cancelled && Array.isArray(serverOrders) && serverOrders.length > 0) {
          setOrders(serverOrders);
          setOrdersError('');
        }
      })
      .catch(() => {
        // Backend offline: silently keep using persisted localStorage orders
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authReady, isAdmin]);

  useEffect(() => {
    localStorage.setItem('ng_services_v7', JSON.stringify(services));
  }, [services]);

  // Actions for Portfolio
  const addPortfolioItem = (item) => {
    const newItem = {
      ...item,
      id: `post-${Date.now()}`,
      views: 0
    };
    setPortfolioItems(prev => [newItem, ...prev]);
  };

  const deletePortfolioItem = (id) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  // Actions for Orders / Revenue
  const addOrder = async (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString().slice(0, 10)
    };
    setOrders(prev => [newOrder, ...prev]);

    // Optional background sync with server if running
    try {
      await adminApiRequest('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
    } catch {
      // Offline safe
    }
    return true;
  };

  const deleteOrder = async (id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
    try {
      await adminApiRequest(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {
      // Offline safe
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    setOrders(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    try {
      await adminApiRequest(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
    } catch {
      // Offline safe
    }
  };

  // Update specific price in a service tier
  const updateServicePrice = (serviceId, tierIndex, newPrice) => {
    setServices(prev => prev.map(s => {
      if (s.id !== serviceId) return s;
      const updatedPricing = s.pricing.map((p, idx) => 
        idx === tierIndex ? { ...p, price: Number(newPrice) } : p
      );
      return { ...s, pricing: updatedPricing };
    }));
  };

  // Reset to default original data
  const resetToDefault = () => {
    setPortfolioItems(INITIAL_PORTFOLIO_ITEMS);
    setServices(INITIAL_SERVICES);
  };

  // Computed Revenue stats
  const totalRevenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);

  const pendingRevenue = orders
    .filter(o => o.status === 'In Progress' || o.status === 'Pending')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);

  return (
    <StudioDataContext.Provider
      value={{
        portfolioItems,
        addPortfolioItem,
        deletePortfolioItem,
        orders,
        addOrder,
        deleteOrder,
        updateOrderStatus,
        ordersLoading,
        ordersError,
        services,
        updateServicePrice,
        totalRevenue,
        pendingRevenue,
        resetToDefault
      }}
    >
      {children}
    </StudioDataContext.Provider>
  );
};

export const useStudioData = () => useContext(StudioDataContext);

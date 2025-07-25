// Service Worker for Forward Horizon Mobile App
const CACHE_NAME = 'forward-horizon-v1';
const STATIC_CACHE = 'forward-horizon-static-v1';
const DYNAMIC_CACHE = 'forward-horizon-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/next.svg',
  '/vercel.svg'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if available
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static files
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'Forward Horizon',
    body: 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'default',
    data: {},
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.log('Failed to parse push data:', error);
      // Use text data as body if JSON parsing fails
      notificationData.body = event.data.text();
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      vibrate: [200, 100, 200], // Vibration pattern
      timestamp: Date.now()
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    console.log('Notification dismissed');
    return;
  }

  // Handle notification click
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if available
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if no existing window
        if (self.clients.openWindow) {
          const urlToOpen = event.notification.data?.url || '/';
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background sync operations
      syncData()
    );
  }
});

// Periodic background sync event
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic background sync event:', event);
  
  if (event.tag === 'periodic-sync') {
    event.waitUntil(
      // Perform periodic sync operations
      periodicSync()
    );
  }
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync function
async function syncData() {
  try {
    console.log('Performing background sync...');
    
    // Sync offline data with server
    const offlineData = await getOfflineData();
    
    for (const data of offlineData) {
      try {
        await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        // Remove synced data from offline storage
        await removeOfflineData(data.id);
      } catch (error) {
        console.log('Failed to sync data:', error);
      }
    }
    
    console.log('Background sync completed');
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Periodic sync function
async function periodicSync() {
  try {
    console.log('Performing periodic sync...');
    
    // Update cached data
    await updateCachedData();
    
    // Check for new notifications
    await checkForNotifications();
    
    console.log('Periodic sync completed');
  } catch (error) {
    console.log('Periodic sync failed:', error);
  }
}

// Get offline data from IndexedDB
async function getOfflineData() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

// Remove offline data after successful sync
async function removeOfflineData(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing offline data:', id);
}

// Update cached data
async function updateCachedData() {
  try {
    // Update resident data
    const residentsResponse = await fetch('/api/residents');
    if (residentsResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put('/api/residents', residentsResponse);
    }
    
    // Update other data as needed
    console.log('Cached data updated');
  } catch (error) {
    console.log('Failed to update cached data:', error);
  }
}

// Check for new notifications
async function checkForNotifications() {
  try {
    const response = await fetch('/api/notifications/check');
    if (response.ok) {
      const notifications = await response.json();
      
      for (const notification of notifications) {
        await self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/favicon.ico',
          badge: notification.badge || '/favicon.ico',
          tag: notification.tag,
          data: notification.data,
          actions: notification.actions,
          requireInteraction: notification.requireInteraction,
          silent: notification.silent
        });
      }
    }
  } catch (error) {
    console.log('Failed to check for notifications:', error);
  }
}

// Utility function to show notification
function showNotification(title, options = {}) {
  return self.registration.showNotification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options
  });
}

console.log('Service Worker script loaded'); 
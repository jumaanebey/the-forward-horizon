"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface InventoryItem {
  id: number;
  name: string;
  category: 'supplies' | 'equipment' | 'medications' | 'maintenance' | 'food' | 'cleaning';
  description?: string;
  sku: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  unit_cost: number;
  supplier?: string;
  location?: string;
  expiry_date?: string;
  last_restocked?: string;
  usage_rate: number; // items per month
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
  created_at: string;
}

interface InventoryManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InventoryManagement({ isOpen, onClose }: InventoryManagementProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'supplies' as InventoryItem['category'],
    description: '',
    sku: '',
    current_stock: '',
    min_stock: '',
    max_stock: '',
    unit: '',
    unit_cost: '',
    supplier: '',
    location: '',
    expiry_date: '',
    usage_rate: ''
  });

  const [restockData, setRestockData] = useState({
    quantity: '',
    cost: '',
    supplier: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchInventory();
    }
  }, [isOpen]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name');

      if (error) {
        toast.error('Failed to fetch inventory');
        return;
      }

      // Process status based on current stock and expiry
      const processedData = (data || []).map(item => {
        let status: InventoryItem['status'] = 'in_stock';
        
        if (item.current_stock <= 0) {
          status = 'out_of_stock';
        } else if (item.current_stock <= item.min_stock) {
          status = 'low_stock';
        }
        
        if (item.expiry_date && new Date(item.expiry_date) < new Date()) {
          status = 'expired';
        }
        
        return { ...item, status };
      });

      setInventory(processedData);
    } catch (error) {
      toast.error('Error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const itemData = {
        name: newItem.name,
        category: newItem.category,
        description: newItem.description || null,
        sku: newItem.sku,
        current_stock: parseInt(newItem.current_stock),
        min_stock: parseInt(newItem.min_stock),
        max_stock: parseInt(newItem.max_stock),
        unit: newItem.unit,
        unit_cost: parseFloat(newItem.unit_cost),
        supplier: newItem.supplier || null,
        location: newItem.location || null,
        expiry_date: newItem.expiry_date || null,
        usage_rate: parseFloat(newItem.usage_rate) || 0
      };

      const { data, error } = await supabase
        .from('inventory')
        .insert([itemData])
        .select();

      if (error) {
        toast.error('Failed to add inventory item');
        return;
      }

      toast.success('Inventory item added successfully');
      setNewItem({
        name: '',
        category: 'supplies',
        description: '',
        sku: '',
        current_stock: '',
        min_stock: '',
        max_stock: '',
        unit: '',
        unit_cost: '',
        supplier: '',
        location: '',
        expiry_date: '',
        usage_rate: ''
      });
      setShowAddItem(false);
      fetchInventory();
    } catch (error) {
      toast.error('Error adding inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    try {
      const newStock = selectedItem.current_stock + parseInt(restockData.quantity);
      const totalCost = parseFloat(restockData.cost);

      const { error } = await supabase
        .from('inventory')
        .update({
          current_stock: newStock,
          last_restocked: new Date().toISOString()
        })
        .eq('id', selectedItem.id);

      if (error) {
        toast.error('Failed to restock item');
        return;
      }

      // Log restock transaction
      await supabase
        .from('inventory_transactions')
        .insert([{
          item_id: selectedItem.id,
          transaction_type: 'restock',
          quantity: parseInt(restockData.quantity),
          cost: totalCost,
          supplier: restockData.supplier || selectedItem.supplier,
          notes: restockData.notes || null
        }]);

      toast.success('Item restocked successfully');
      setRestockData({
        quantity: '',
        cost: '',
        supplier: '',
        notes: ''
      });
      setShowRestockModal(false);
      setSelectedItem(null);
      fetchInventory();
    } catch (error) {
      toast.error('Error restocking item');
    } finally {
      setLoading(false);
    }
  };

  const handleUseItem = async (itemId: number, quantity: number) => {
    setLoading(true);
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) return;

      const newStock = Math.max(0, item.current_stock - quantity);

      const { error } = await supabase
        .from('inventory')
        .update({ current_stock: newStock })
        .eq('id', itemId);

      if (error) {
        toast.error('Failed to update item usage');
        return;
      }

      // Log usage transaction
      await supabase
        .from('inventory_transactions')
        .insert([{
          item_id: itemId,
          transaction_type: 'usage',
          quantity: quantity,
          cost: 0,
          notes: 'Item used'
        }]);

      toast.success('Item usage recorded');
      fetchInventory();
    } catch (error) {
      toast.error('Error recording item usage');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemId);

      if (error) {
        toast.error('Failed to delete item');
        return;
      }

      toast.success('Inventory item deleted successfully');
      fetchInventory();
    } catch (error) {
      toast.error('Error deleting item');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredInventory = () => {
    return inventory.filter(item => {
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesSearch;
    });
  };

  const getInventorySummary = () => {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
    const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length;
    const expiredItems = inventory.filter(item => item.status === 'expired').length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.current_stock * item.unit_cost), 0);

    return { totalItems, lowStockItems, outOfStockItems, expiredItems, totalValue };
  };

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: InventoryItem['category']) => {
    switch (category) {
      case 'supplies': return 'bg-blue-100 text-blue-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'medications': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'cleaning': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  const filteredInventory = getFilteredInventory();
  const summary = getInventorySummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
            <p className="text-gray-600">Track supplies, equipment, and facility resources</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Total Items</div>
              <div className="text-2xl font-bold text-blue-600">{summary.totalItems}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Low Stock</div>
              <div className="text-2xl font-bold text-yellow-600">{summary.lowStockItems}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Out of Stock</div>
              <div className="text-2xl font-bold text-red-600">{summary.outOfStockItems}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Expired</div>
              <div className="text-2xl font-bold text-gray-600">{summary.expiredItems}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Total Value</div>
              <div className="text-2xl font-bold text-green-600">${summary.totalValue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="supplies">Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="medications">Medications</option>
              <option value="maintenance">Maintenance</option>
              <option value="food">Food</option>
              <option value="cleaning">Cleaning</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No inventory items found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Stock</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Cost</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">SKU: {item.sku}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(item.category)}`}>
                          {item.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div>
                          <div className="font-medium">{item.current_stock} {item.unit}</div>
                          <div className="text-sm text-gray-600">
                            Min: {item.min_stock} | Max: {item.max_stock}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        ${item.unit_cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {item.location || '-'}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowRestockModal(true);
                            }}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => handleUseItem(item.id, 1)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          >
                            Use
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Item Modal */}
        {showAddItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Inventory Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      required
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value as InventoryItem['category']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="supplies">Supplies</option>
                      <option value="equipment">Equipment</option>
                      <option value="medications">Medications</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="food">Food</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      required
                      value={newItem.sku}
                      onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                    <input
                      type="number"
                      required
                      value={newItem.current_stock}
                      onChange={(e) => setNewItem({...newItem, current_stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                    <input
                      type="number"
                      required
                      value={newItem.min_stock}
                      onChange={(e) => setNewItem({...newItem, min_stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                    <input
                      type="number"
                      required
                      value={newItem.max_stock}
                      onChange={(e) => setNewItem({...newItem, max_stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input
                      type="text"
                      required
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      placeholder="pcs, kg, liters, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newItem.unit_cost}
                      onChange={(e) => setNewItem({...newItem, unit_cost: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input
                      type="text"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newItem.expiry_date}
                      onChange={(e) => setNewItem({...newItem, expiry_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Rate (per month)</label>
                    <input
                      type="number"
                      value={newItem.usage_rate}
                      onChange={(e) => setNewItem({...newItem, usage_rate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddItem(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Restock Modal */}
        {showRestockModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restock {selectedItem.name}</h3>
              <form onSubmit={handleRestock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <div className="text-lg font-medium text-gray-900">
                    {selectedItem.current_stock} {selectedItem.unit}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                  <input
                    type="number"
                    required
                    value={restockData.quantity}
                    onChange={(e) => setRestockData({...restockData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={restockData.cost}
                    onChange={(e) => setRestockData({...restockData, cost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={restockData.supplier}
                    onChange={(e) => setRestockData({...restockData, supplier: e.target.value})}
                    placeholder={selectedItem.supplier || 'Enter supplier'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={restockData.notes}
                    onChange={(e) => setRestockData({...restockData, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRestockModal(false);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Restocking...' : 'Restock Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
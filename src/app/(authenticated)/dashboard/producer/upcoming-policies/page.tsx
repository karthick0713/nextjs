'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProducerProductsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Products</h1>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product List</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                Add New Product
              </button>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-gray-600">Product list will be implemented here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerProductsPage;

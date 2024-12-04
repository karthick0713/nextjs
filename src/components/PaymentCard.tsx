"use client";
import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "./ui/checkbox";

const PaymentCard = ({ 
    annualPremium, tax, taxAmount, convenienceFee }: 
    { annualPremium: number; tax: number; taxAmount: number; convenienceFee: number }) => {
    const [includeConvenienceFee, setIncludeConvenienceFee] = useState(false);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    useEffect(() => {
        const calculatedTotal = annualPremium + taxAmount + (includeConvenienceFee ? convenienceFee : 0);
        setCalculatedTotal(calculatedTotal);
    }, [annualPremium, taxAmount, convenienceFee, includeConvenienceFee]);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <table className="w-full">
                        <tbody>
                        <tr>
                            <td className="py-2"><Label>Annual Premium</Label></td>
                            <td className="py-2 text-right">${(annualPremium).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="py-2"><Label>Taxes {tax}%</Label></td>
                            <td className="py-2 text-right">${(taxAmount).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="py-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                id="convenienceFee"
                                checked={includeConvenienceFee}
                                onCheckedChange={(checked) => setIncludeConvenienceFee(checked as boolean)}
                                />
                                <Label htmlFor="convenienceFee">Convenience Fee</Label>
                            </div>
                            </td>
                            <td className="py-2 text-right">${includeConvenienceFee ? convenienceFee.toFixed(2) : '0.00'}</td>
                        </tr>
                        <tr className="font-bold">
                            <td className="pt-4"><Label>Total</Label></td>
                            <td className="pt-4 text-right">${(calculatedTotal).toFixed(2)}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentCard;
import React from 'react';
import { Control, Form, UseFormWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ContactInformationProps } from '@/lib/models';

import { GooglePlacesAutoComplete } from './GooglePlaceAutoComplete';


export function ContactInformation({ 
  control, 
  watch,
  setValue,
  address,
  isMailingSame = false,
  mailing_address,
  phone_no,
  fax_no,
  website_url,
  email,
  confirmEmail
}: ContactInformationProps) {
  const watchIsMailingSame  = watch('isMailingSame');

  return (
    <Card>  
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 ">
              <FormField
                control={control}
                name="google_address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Search Address</FormLabel>
                    <FormControl>
                      <GooglePlacesAutoComplete 
                        control={control}
                        setValue={setValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                {/* <GooglePlacesAutocomplete /> */}
                <FormField
                  control={control}
                  name="address.address_line1"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address.address_line2"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Apt/Suite</FormLabel>
                      <FormControl>
                        <Input placeholder="Apt/Suite" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address.county"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>County</FormLabel>
                      <FormControl>
                        <Input placeholder="County" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address.zipcode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <FormField
                  control={control}
                  name="isMailingSame"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Checkbox 
                           
                          checked={field.value}
                          onCheckedChange={field.onChange} />
                      </FormControl>
                      
                        <FormLabel className="text-sm font-medium p-4 space-y-0 leading-none">
                          Is Mailing address same as above business address?
                        </FormLabel>
                                
                      
                    </FormItem>
                  )}
                />
              </div>
              {!watch('isMailingSame') && (
                <div className="flex flex-col p-6 border border-gray-200 border-padding rounded-md md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  
                    
                      <FormField
                        control={control}
                        name="mailing_address.address_line1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Address line 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="mailing_address.address_line2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apt/Suite</FormLabel>
                            <FormControl>
                              <Input placeholder="Apt/Suite" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="mailing_address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="mailing_address.county"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>County</FormLabel>
                            <FormControl>
                              <Input placeholder="County" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="mailing_address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="mailing_address.zipcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Zip Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                </div>
              )}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <FormField
                  control={control}
                  name="phone_no"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="fax_no"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fax</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Fax Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Website URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div></div>
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="confirmEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Confirm Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Confirm your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
  );
}
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const RenewalCheckbox = ({ 
  control, 
  name, 
  label 
}: { 
  control: any;
  name: string;
  label: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.value === true}
                onCheckedChange={(checked) => {
                  field.onChange(checked ? true : false);
                }}
              />
              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
              </FormLabel>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RenewalCheckbox;
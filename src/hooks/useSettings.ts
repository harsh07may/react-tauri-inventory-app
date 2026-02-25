import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDb } from '../db';

export interface ShopSettings {
  shopName: string;
  taxNumber: string;
  defaultTaxPercent: number;
}

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<ShopSettings> => {
      const db = await getDb();
      const rows = await db.select<{setting_key: string, setting_value: string}[]>(
        "SELECT setting_key, setting_value FROM shop_settings"
      );
      
      const config: Record<string, string> = {};
      rows.forEach(r => {
        config[r.setting_key] = r.setting_value;
      });

      return {
        shopName: config['shop_name'] || 'My Awesome Retail Shop',
        taxNumber: config['tax_number'] || '',
        defaultTaxPercent: parseFloat(config['default_tax_percent'] || '18')
      };
    }
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: ShopSettings) => {
      const db = await getDb();
      await db.execute("BEGIN TRANSACTION");
      try {
        await db.execute("INSERT OR REPLACE INTO shop_settings (setting_key, setting_value) VALUES ('shop_name', $1)", [settings.shopName]);
        await db.execute("INSERT OR REPLACE INTO shop_settings (setting_key, setting_value) VALUES ('tax_number', $1)", [settings.taxNumber]);
        await db.execute("INSERT OR REPLACE INTO shop_settings (setting_key, setting_value) VALUES ('default_tax_percent', $1)", [settings.defaultTaxPercent.toString()]);
        await db.execute("COMMIT");
      } catch (err) {
        await db.execute("ROLLBACK");
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });
};

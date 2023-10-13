'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { FormSchema } from './startingInventoryListShared';

type FormWatcherProps = {
  useFormRet: UseFormReturn<FormSchema>;
};

function FormWatcher({ useFormRet }: FormWatcherProps) {
  const watchAllFields = useFormRet.watch();

  console.log('watchAllFields');
  console.log(watchAllFields);

  return null;
}

export default FormWatcher;

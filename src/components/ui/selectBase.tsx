import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { FormControl } from './form';
const SelectBase = ({field}) => {
  return (
    <div>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder= "בחר בסיס מתוך הרשימה"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ירקון">ירקון</SelectItem>
                      <SelectItem value="רמות">רמות</SelectItem>
                      <SelectItem value="יועץ">יועץ</SelectItem>
                    </SelectContent>
                  </Select>
    </div>
  )
}

export default SelectBase
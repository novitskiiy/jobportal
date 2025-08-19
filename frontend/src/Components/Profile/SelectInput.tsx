import { useEffect, useState } from 'react';
import { Combobox, InputBase, ScrollArea, TextInput, useCombobox } from '@mantine/core';


const SelectInput=(props:any)=> {
    useEffect(()=>{
        setData(props.options);
        setValue(props.form.getInputProps(props.name).value);
        setSearch(props.form.getInputProps(props.name).value);
    }, [])
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [data, setData] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const exactOptionMatch = data.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) => item.toLowerCase().includes(search?.toLowerCase().trim()));

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      position="bottom-start"
      onOptionSubmit={(val) => {
        if (val === '$create') {
          setData((current) => [...current, search]);
          setValue(search);
          props.form.setFieldValue(props.name,search);
        } else {
          setValue(val);
          setSearch(val);
          props.form.setFieldValue(props.name,val);
        }
        combobox.closeDropdown();
      }}
      classNames={{
        dropdown: 'bg-mine-shaft-800 border border-mine-shaft-700 shadow-lg',
        option: 'hover:bg-mine-shaft-700 text-mine-shaft-200',
        options: 'p-0'
      }}
    >
      <Combobox.Target>
        <InputBase 
          label={props.label} 
          withAsterisk
          rightSection={<Combobox.Chevron />}
          leftSection={<props.leftSection className="text-mine-shaft-400" stroke={1.5}/>}
          {...props.form.getInputProps(props.name)}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || '');
          }}
          placeholder={props.placeholder}
          rightSectionPointerEvents="none"
          classNames={{
            input: 'bg-mine-shaft-800 border-mine-shaft-700 focus:border-brightSun-400 transition-colors duration-200',
            label: 'text-mine-shaft-200 font-medium mb-2',
            wrapper: 'w-full'
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
        <ScrollArea.Autosize mah={200} type="scroll">
          {options}
          {!exactOptionMatch && search?.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
export default SelectInput;
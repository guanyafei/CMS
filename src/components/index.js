'use strict';

import Table from './table';
import TableColumn from './table/TableColumn';
import Pagination from './pagination/pagination';
import Form from './form/form';
import FormItem from './form/form-item';

import FormTip from './formtip';
import Confirm from './confirm/confirm';

import Input from './input/Input';
import Checkbox from './checkbox/Checkbox';
import RectCheckbox from './checkbox/RectCheckbox';
import CheckboxGroup from './checkbox/CheckboxGroup';
import Radio from './radio/Radio';
import RectRadio from './radio/RectRadio';

import RadioGroup from './radio/RadioGroup';
import Select from './select';
import SelectOption from './select/option';
import SelectInput from './select-advanced/SelectInput';
import SelectFilter from './select-advanced/SelectFilter';

import SelectTags from './select-advanced/SelectTags';
import NSelectTags from './select-advanced/NSelectTags';
import Rate from './rate';
import Timer from './timer/';
import Cropper from './cropper';

import CropperThree from './cropper-three';
import TopBar from './topbar/TopBar';
import Button from './button/button';

import TdEllipsis from './tdElement/ellipsis';
import TdDate from './tdElement/date';
import TdAuthor from './tdElement/tdAuthor';
import TimeAxis from './timeaxis/TimeAxis';
import ScrollLoader from './scroller/ScrollLoader';

import SearchBox from './search-box';
import SearchItem from './search-box/search-item';
import VideoUploader from './videoUploader';
import ColorPicker from './color-picker';

import Autocomplete from './new-frame/autocomplete';
import Icon from './new-frame/icon';
import { Datatable, DataColumn } from './new-frame/table';
import { Tabs, TabPane } from './new-frame/tabs';
import SnDialog from './new-frame/dialog';

export default {
  SnDatatable: Datatable,
  SnDatacolumn: DataColumn,
  SnTable: Table,
  SnTableColumn: TableColumn,
  SnTabs: Tabs,
  SnTabPane: TabPane,
  SnPagination: Pagination,
  SnForm: Form,
  SnFormItem: FormItem,

  SnFormtip: FormTip,
  SnConfirm: Confirm,
  SnInput: Input,
  SnAutocomplete: Autocomplete,

  SnCheckbox: Checkbox,
  SnRectCheckbox: RectCheckbox,
  SnCheckboxGroup: CheckboxGroup,
  SnRadio: Radio,
  SnRectRadio: RectRadio,

  SnRadioGroup: RadioGroup,
  SnSelect: Select,
  SnOption: SelectOption,
  SnSelectInput: SelectInput,
  SnSelectFilter: SelectFilter,

  SnSelectTags: SelectTags,
  SnNSelectTags: NSelectTags,
  SnRate: Rate,
  SnCropper: Cropper,
  SnCropperThree: CropperThree,

  SnTimer: Timer,
  SnTopbar: TopBar,
  SnButton: Button,
  SnTdEllipsis: TdEllipsis,

  SnTdDate: TdDate,
  SnTdAuthor: TdAuthor,
  SnTimeAxis: TimeAxis,
  SnScrollLoader: ScrollLoader,
  SnSearchBox: SearchBox,

  SnSearchItem: SearchItem,
  SnVideoUploader: VideoUploader,
  SnColorPicker: ColorPicker,
  SnIcon: Icon,
  SnDialog: SnDialog,
};

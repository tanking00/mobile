[TOC]

| 版本号  | 作者   | 更新日期          | 备注             |
| ------- | ------ | ----------------- | ---------------- |
| v1.1.0  | 谭坪盛 | 2021 年 2 月 5 日 | 新建组件使用手册 |
| v1.12.0 | 谭坪盛 | 2021 年 3 月 1 日 | 新增多个组件     |
| v1.13.0 | 谭坪盛 | 2021 年 3 月 2 日 | 新增文件上传组件 |
| v1.14.0 | 谭坪盛 | 2021 年 3 月 3 日 | 新增文本域组组件 |

## <center>卡斯柯 H5 组件使用手册<center/>

#### 1、提交按钮（SubmitButton、SubmitButtonItem、SubmitButtonSpecial）

##### 使用示例：

```vue
<SubmitButton @click="onClickSubmit" text="签署"></SubmitButton>
<SubmitButton>
    <SubmitButtonSpecial @click="onClickSubmit"></SubmitButtonSpecial>
    <SubmitButtonItem @click="onClickSubmit" type="gray">退回</SubmitButtonItem>
    <SubmitButtonItem @click="onClickSubmit">同意</SubmitButtonItem>
</SubmitButton>
备注： fixed为true时，需添加底部padding，给最外层div添加class:submit-button-height
```

##### Props：(SubmitButton)

| 名称     | 说明                                                                                 | 类型    | 默认值 |
| -------- | ------------------------------------------------------------------------------------ | ------- | ------ |
| position | 位置显示方式：可选 relative(不固定)、fixed（固定页面底部）、absolute（固定容器底部） | string  | fixed  |
| text     | 按钮文字(一个按钮必传，多个按钮不传)                                                 | string  | ""     |
| type     | 按钮颜色类型(primary、info、warning、danger)                                         | string  | info   |
| disabled | 是否禁用                                                                             | boolean | false  |

##### Props：(SubmitButtonItem)

| 名称     | 说明                                               | 类型    | 默认值 |
| -------- | -------------------------------------------------- | ------- | ------ |
| type     | 按钮颜色类型(primary、info、warning、danger、gray) | string  | info   |
| disabled | 是否禁用                                           | boolean | false  |

##### Props：(SubmitButtonSpecial)

| 名称     | 说明      | 类型    | 默认值   |
| -------- | --------- | ------- | -------- |
| text     | 按钮文字  | string  | 转办指派 |
| icon     | icon 图标 | string  | bm-turn  |
| disabled | 是否禁用  | boolean | false    |

##### Events：(SubmitButton、SubmitButtonItem、SubmitButtonSpecial)

| 名称  | 说明         | 返回值 |
| ----- | ------------ | ------ |
| click | 按钮点击事件 |        |

##### Slots：(SubmitButton)

| 名称    | 说明                                 |
| ------- | ------------------------------------ |
| default | SubmitButtonItem/SubmitButtonSpecial |

##### Slots：(SubmitButtonItem)

| 名称    | 说明     |
| ------- | -------- |
| default | 按钮文字 |

#### 2、提交面板（SubmitPanel）

##### 使用示例：

```vue
<SubmitPanel v-model="showPanel" title="审批意见" buttonText="确认转办" @submit="onClickForm">
    <van-form ref="form" @failed="onFailedForm1" @submit="onSubmitForm" :show-error-message="false">
        <div class="form-label-required">意见说明</div>
        <van-field
			v-model="form1.opinion"
			name="意见说明"
			rows="4"
			type="textarea"
			maxlength="1000"
			placeholder="请填写意见说明"
			:rules="[{ required: true, message: '请填写意见说明' }]"
			show-word-limit
			class="form-textarea"
		/>
    </van-form>
</SubmitPanel>
```

##### Props：

| 名称       | 说明               | 类型    | 默认值 |
| ---------- | ------------------ | ------- | ------ |
| v-model    | 是否显示           | boolean | false  |
| title      | 标题               | string  | ""     |
| buttonText | 按钮文字           | string  | 确认   |
| isLarge    | 是否大号，大号更高 | boolean | false  |

#####

| 名称   | 说明             | 返回值   |
| ------ | ---------------- | -------- |
| change | v-model          | 是否显示 |
| submit | 点击提交按钮回调 |          |

#### 3、搜索面板（SearchPanel）

##### 使用示例：

```vue
<SearchPanel v-model="showSearch" name="TemplateList" @search="onSearch"></SearchPanel>
```

##### Props：

| 名称    | 说明                                    | 类型    | 默认值 |
| ------- | --------------------------------------- | ------- | ------ |
| v-model | 是否显示                                | boolean | false  |
| name    | 使用面板台账的 name，存储搜索记录的标志 | string  | ""     |

##### Events：

| 名称   | 说明     | 返回值             |
| ------ | -------- | ------------------ |
| change | v-model  | 是否显示           |
| search | 搜索回调 | 搜索框的内容 value |

#### 4、空列表（EmptyList）

##### 使用示例：

```vue
<EmptyList description="暂无数据" class="refresh-min-height-m" /> 备注：
需添加class来填充高度，可选class:refresh-min-height-xs、refresh-min-height-s、refresh-min-height-m、refresh-min-height-l
```

##### Props：

| 名称        | 说明     | 类型   | 默认值   |
| ----------- | -------- | ------ | -------- |
| description | 描述文字 | string | 暂无数据 |

#### 5、流程信息面板（ProcessInfoPanel）

##### 使用示例：

```vue
<ProcessInfoPanel :processCode="processCode" :steps="steps" :stepActive="stepActive"></ProcessInfoPanel>
```

##### Props：

| 名称        | 说明         | 类型   | 默认值   |
| ----------- | ------------ | ------ | -------- |
| title       | 标题         | string | 流程信息 |
| processCode | 流程编号     | string | “”       |
| steps       | 流程步骤信息 | Array  | []       |
| stepAct     | 当前步骤     | number | 0        |

#### 6、日期范围下拉选择（DateRangeDropdownPicker）

##### 使用示例：

```vue
<van-dropdown-menu>
    <DateRangeDropdownPicker title="操作时间" @change="onTimeChange"></DateRangeDropdownPicker>
</van-dropdown-menu>
```

##### Props：

| 名称  | 说明 | 类型   | 默认值   |
| ----- | ---- | ------ | -------- |
| title | 标题 | string | 操作时间 |

##### Events：

| 名称   | 说明     | 返回值                       |
| ------ | -------- | ---------------------------- |
| change | 选完回调 | startTime、endTime（时间戳） |

#### 7、时间范围下拉选择（TimeRangeDropdownPicker）

##### 使用示例：

```vue
<van-dropdown-menu>
    <TimeRangeDropdownPicker title="操作时间" @change="onTimeChange"></TimeRangeDropdownPicker>
</van-dropdown-menu>
```

##### Props：

| 名称  | 说明 | 类型   | 默认值   |
| ----- | ---- | ------ | -------- |
| title | 标题 | string | 操作时间 |

##### Events：

| 名称   | 说明     | 返回值                       |
| ------ | -------- | ---------------------------- |
| change | 选完回调 | startTime、endTime（时间戳） |

#### 8、时间下拉选择（MonthDropdownPicker）

##### 使用示例：

```vue
<van-dropdown-menu>
    <MonthDropdownPicker title="时间选择" type="year-month" @change="onTimeChange"></MonthDropdownPicker>
</van-dropdown-menu>
```

##### Props：

| 名称  | 说明                               | 类型   | 默认值   |
| ----- | ---------------------------------- | ------ | -------- |
| title | 标题                               | string | 时间选择 |
| type  | 类型(date:年月日、year-month:年月) | string | date     |

##### Events：

| 名称   | 说明     | 返回值 |
| ------ | -------- | ------ |
| change | 选完回调 | 时间戳 |

#### 9、部门下拉选择（DeptDropdownPicker）

##### 使用示例：

```vue
<van-dropdown-menu>
    <DeptDropdownPicker title="责任部门" @change="onChangeDept"></DeptDropdownPicker>
</van-dropdown-menu>
```

##### Props：

| 名称  | 说明 | 类型   | 默认值   |
| ----- | ---- | ------ | -------- |
| title | 标题 | string | 责任部门 |

##### Events：

| 名称   | 说明     | 返回值         |
| ------ | -------- | -------------- |
| change | 选完回调 | 选中的部门对象 |

#### 10、图片上传（UploadImage）

##### 使用示例：

```vue
<UploadImage v-model="imageList" :default="defaultList" :maxCount="5" :maxSize="5" :maxUploadSize="0.5"></UploadImage>
```

##### Props：

| 名称          | 说明                                           | 类型          | 默认值     |
| ------------- | ---------------------------------------------- | ------------- | ---------- |
| v-model       | 图片 ID 列表                                   | Array[number] | []         |
| default       | 默认显示的图片数组                             | Array[Object] | []         |
| accept        | 允许上传的图片类型,仅限 image/\*范围内         | string        | image/\*   |
| maxCount      | 上传数量限制                                   | number        | 6          |
| maxSize       | 选取大小限制，单位为 M                         | number        | 10         |
| maxUploadSize | 上传大小限制，单位为 M，超过会压缩             | number        | 1          |
| disabled      | 是否禁用，不显示删除按钮                       | boolean       | false      |
| capture       | 图片选取模式，可选值为 camera (直接调起摄像头) | string        | null       |
| uploadText    | 上传区域文字提示                               | string        | ""         |
| imageFit      | 预览图裁剪模式                                 | string        | cover      |
| uploadIcon    | 上传区域图标                                   | string        | photograph |
| tips          | 下方提示文字                                   | string        | ""         |

##### Events：

| 名称   | 说明    | 返回值       |
| ------ | ------- | ------------ |
| change | v-model | 图片 ID 列表 |

#### 11、文件上传（UploadFile）

##### 使用示例：

```vue
<UploadFile
  v-model="fileList"
  :default="defaultList"
  :maxCount="5"
  :maxSize="10"
  :accepts="['pdf', 'word']"
></UploadFile>
```

##### Props：

| 名称          | 说明                                                                       | 类型          | 默认值     |
| ------------- | -------------------------------------------------------------------------- | ------------- | ---------- |
| v-model       | 文件 ID 列表                                                               | Array[number] | []         |
| default       | 默认显示的文件数组                                                         | Array[Object] | []         |
| accepts       | 允许上传的文件类型数组,不传不限制,可选值['png','jpg','word','pdf','excel'] | Array[string] | ""         |
| maxCount      | 上传数量限制                                                               | number        | 6          |
| maxSize       | 选取文件大小限制，单位为 M                                                 | number        | 10         |
| maxUploadSize | 上传图片大小限制，单位为 M，超过会压缩                                     | number        | 1          |
| disabled      | 是否禁用，不显示删除按钮                                                   | boolean       | false      |
| capture       | 图片选取模式，可选值为 camera (直接调起摄像头)                             | string        | null       |
| uploadText    | 上传区域文字提示                                                           | string        | ""         |
| imageFit      | 预览图裁剪模式                                                             | string        | cover      |
| uploadIcon    | 上传区域图标                                                               | string        | photograph |
| tips          | 下方提示文字                                                               | string        | ""         |

##### Events：

| 名称   | 说明    | 返回值       |
| ------ | ------- | ------------ |
| change | v-model | 文件 ID 列表 |

#### 12、人员选择模糊搜索面板（PeopleSearchPanel）

##### 使用示例：

```vue
<PeopleSearchPanel v-model="showPeopleSearchPanel" @select="onSelect"></PeopleSearchPanel>
```

##### Props：

| 名称          | 说明           | 类型    | 默认值 |
| ------------- | -------------- | ------- | ------ |
| v-model       | 是否显示       | boolean | false  |
| chooseOneself | 是否可以选自己 | boolean | false  |

##### Events：

| 名称   | 说明     | 返回值     |
| ------ | -------- | ---------- |
| change | v-model  | 是否显示   |
| select | 选中回调 | 选中人对象 |

#### 13、时间选择面板（DatePickerSheet）

##### 使用示例：

```vue
<DatePickerSheet v-model="showDatePickerSheet" type="date" @select="onSelect"></DatePickerSheet>
```

##### Props：

| 名称    | 说明                               | 类型    | 默认值 |
| ------- | ---------------------------------- | ------- | ------ |
| v-model | 是否显示                           | boolean | false  |
| type    | 类型(date:年月日、year-month:年月) | string  | date   |

##### Events：

| 名称   | 说明     | 返回值   |
| ------ | -------- | -------- |
| change | v-model  | 是否显示 |
| select | 选中回调 | 时间戳   |

#### 14、文本域组(隐患上报)（TextFieldGroup）

##### 使用示例：

```vue
<TextFieldGroup v-model="list" @startHazard="startHazard"></TextFieldGroup>
```

##### Props：

| 名称        | 说明                                                                               | 类型          | 默认值         |
| ----------- | ---------------------------------------------------------------------------------- | ------------- | -------------- |
| v-model     | [{ content: '', status: '0' }],content:文本域的内容,status:是否发起隐患'1'是,'0'否 | Array[Object] | []             |
| placeholder | 文本域占位符                                                                       | string        | 请填写问题描述 |
| errMessage  | 错误提示语                                                                         | string        | 请填写问题描述 |

##### Events：

| 名称        | 说明         | 返回值       |
| ----------- | ------------ | ------------ |
| input       | v-model      |              |
| startHazard | 点击发起隐患 | 点击的 index |

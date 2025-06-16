import axios from "axios";
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const config = {
  /** 是否只生成定义文件，默认为false */
  typesOnly: false,
  /** 缩进尺寸 */
  indentSize: 2,
  /** API 命名空间前缀，用于 declare namespace {typeNameSpace} {} */
  typeNameSpace: 'APIMintpad',
  /** 所有服务所在的文件夹 */
  rootFolderPath: path.resolve(__dirname, '..', 'src', 'server'),
  /** 当前服务的文件夹名称 */
  serviceFolderName: 'mintpad',
  /** 服务在代码中的变量名称 */
  serviceVariableName: 'mintpad',
  /** 加载swagger json */
  async loadJSON() {
    // https://bescard.rivtower.cc/devops/swagger/index.html
    const res = await axios.get('https://bescard.rivtower.cc/devops/swagger/v1/swagger.json', {});
    return res.data;
  },
  /** 用于过滤接口或者对接口的返回进行一定的修改 */
  beforePathProcess(path, schemas) {
    /** 过滤一些不需要的接口 */
    if (path.url.indexOf('/api/v1/admin') !== -1) return null;
    if (path.url.indexOf('/api/v1') === -1) return null;
    /** 移除多余的前缀 */
    path.url = path.url.replace('/api/v1', '');
    /** 跳过接口返回的通用返回结构取核心data */
    const reponseType = path.response?.type;
    if (reponseType && schemas[reponseType]) {
      const propertyData = schemas[reponseType]?.properties?.find(item => item.name === 'data');
      if (propertyData) {
        console.log(`replace response type ${reponseType} to ${propertyData.type}`);
        path.response = { ...propertyData, name: '' };
      }
    }
    /** 对一些返回是文件内容的接口的返回做一些修正 */
    // if (!path.response && (path.url.indexOf('/export') !== -1)) {
    //   path.response = {
    //     type: 'file'
    //   };
    // }
    return path;
  },
  /** 自定义每个path的索引字符串 */
  // onPathIndexRender(method: string, url: string) {
  //   return `${method} ${url}`;
  // },
  /** 可以在这里修改schema以符合前端代码真是的需求 */
  beforeRenderSchema(schema) {
    const buildEnum = buildEnumHOF(schema);
    buildEnum("DobStatus", () => {
      schema.enumVariableName = "EVENT_STATUS";
      schema.enums = [
        // { value: 0, name: "UNKNOWN" },
        { value: 1, name: "COMING_SOON" },
        { value: 2, name: "OPEN" },
        { value: 3, name: "CLOSED" },
      ]
    });
    buildEnum("CurrencyType", () => {
      schema.enumVariableName = "CURRENCY_TYPE";
      schema.enums = [
        // { value: 0, name: "UNKNOWN" },
        { value: 1, name: "USDT" },
        { value: 2, name: "USDC" },
        { value: 3, name: "USDI" },
      ]
    });

    buildEnum("DobType", () => {
      schema.enumVariableName = "EVENT_TYPE";
      schema.enums = [
        // { value: 0, name: "UNKNOWN" },
        { value: 1, name: "DOB" },
        { value: 2, name: "DOB_SERIES" },
        { value: 3, name: "BLIND_BOX" },
      ]
    });

    buildEnum("DataType", () => {
      schema.enumVariableName = "IMAGE_FORMAT_TYPE";
      schema.enums = [
        { value: 0, name: "UNKNOWN" },
        { value: 1, name: "BASE64" },
        { value: 2, name: "URL" },
        { value: 3, name: "JSON_RESOURCE_TYPE" },
        { value: 4, name: "DOB0" },
        // { value: 99, name: "OSS_FILE_ID" },
      ]
    });

    buildEnum("OrderStatus", () => {
      schema.enumVariableName = "ORDER_STATUS";
      schema.enums = [
        // { value: 0, name: "UNKNOWN" },
        { value: 1, name: "UNSIGNED" },
        { value: 2, name: "PROCESSING" },
        { value: 3, name: "COMPLETE" },
        { value: 4, name: "FAILED" },
        { value: 5, name: "SIGN_TIMEOUT" },
        { value: 6, name: "CANCELED" },
        // { value: 99, name: "OSS_FILE_ID" },
      ]
    });
  },
};
export default config;


/**
 * 将scheme中的enums改写成 Array<{ value: string | number, description?: string, name: string }> 结构 ，脚本将自动生成枚举
 */
const buildEnumHOF = (schema) => (targetSchemaName, f) => {
  if (schema.name !== targetSchemaName || !schema.enums)
    return;
  const originEnums = schema.enums;
  f();
  console.log(`generate Enum ${schema.enumVariableName} { ${schema.enums.map(e => `${e.name} = ${e.value}`).join(', ')} } from type ${schema.name} {  ${originEnums.join(', ')} } `)
  if (originEnums?.length > schema.enums.length + 1) {
    console.warn(`${schema.name} enum length changed`);
  }
};

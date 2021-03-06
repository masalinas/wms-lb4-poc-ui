/**
 * wms-lb4-poc-api
 * WMS Loopback 4 PoC API
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { StockIncludeFilterItems } from './stockIncludeFilterItems';
import { StockFields } from './stockFields';


export interface StockFilter1 { 
    offset?: number;
    limit?: number;
    skip?: number;
    order?: Array<string>;
    where?: { [key: string]: object; };
    fields?: StockFields;
    include?: Array<StockIncludeFilterItems>;
}


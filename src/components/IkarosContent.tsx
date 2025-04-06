import { Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosClient';
import {EntityListDataAPIResponse, MetaColumn} from '@/types/APIResponses/EntityListDataAPI';

function IkarosContent(props:{listId:string|null}){
  const [data, setData] = useState<readonly any[] | undefined>([]);
  const [tableColumns, setTableColumns] = useState<any[] | undefined>([]);
  //   {
  //       key: '1',
  //       name: 'Mike',
  //       age: 32,
  //       address: '10 Downing Street',
  //     },
  //     {
  //       key: '2',
  //       name: 'John',
  //       age: 42,
  //       address: '10 Downing Street',
  //     }
  // ];
    // {
    //     title: 'Name',
    //     dataIndex: 'name',
    //     key: 'name',
    //     render: (text:string) => <h1>{text}</h1>,
    //   },
    //   {
    //     title: 'Age',
    //     dataIndex: 'age',
    //     key: 'age',
    //   },
    //   {
    //     title: 'Address',
    //     dataIndex: 'address',
    //     key: 'address',
    //   },
  // ];
  useEffect(()=>{
    console.log("inside useeffect of content");
    const fetchData = async()=>{
      try{
        console.log("List Id in Content Component ==> "+ props.listId)
        const apiResponse = await axiosInstance.post<EntityListDataAPIResponse>('list/'+props.listId+'/entityListData');
      
        const response: EntityListDataAPIResponse = apiResponse.data;

        if(response.success)
        {
          const metaData = response.response.metadata;
          const listData =  response.response.listData;
          const actions = response.response.actions;
          const finalMeta = [];
          const finalData = [];
          // filling meta for table

          let i =0;
          for(const mc of metaData.columns)
          {
            if(mc.name.toLowerCase() === "id")
            {
              const obj = {
                title: mc.name,
                dataIndex:mc.name,
                key:mc.name,
                render: (text:string) => <a href={"/partners/"+text.split(":;")[1]}>{text.split(":;")[0]}</a>
              }
              finalMeta.push(obj);
            }
            else{
            const obj = {
              title: mc.name,
              dataIndex:mc.name,
              key:mc.name
            }
            finalMeta.push(obj);
          }
          }
          for(const row of listData.data)
          {
            i++;
            const obj:{ [key: string]: any} = {};
            obj["key"]=i+"";
            for(const col of row)
            {
              obj[col.columnName]= col.value;
            }
            finalData.push(obj);
          }

          setTableColumns(finalMeta);
          setData(finalData);
        }

      }
      catch(error)
      {
        console.log("Error ==> "+ error);
      }
    }
      fetchData();

  },[props.listId]);

  return(
      <>
        <div>
          <Table dataSource={data} columns={tableColumns} />
        </div>
      </>
    );
}
export default IkarosContent;
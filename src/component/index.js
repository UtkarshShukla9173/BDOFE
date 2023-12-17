import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllData,
  fetchBatchNum,
  fetchDownloadData,
  fetchData,
} from "../redux/slices/ToDoSlice";
import { Button, Form, Select, Table } from "antd";

const Home = () => {
  // filtre functions

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const state = useSelector((state) => state.data);

  const [dataTable, setDataTable] = useState();
  const [tabledata, setTableData] = useState([]);

  useEffect(() => {
    const queryParams = "";
    dispatch(fetchData(queryParams));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllData());
    dispatch(fetchBatchNum());
  }, [dispatch]);


const data=state.allData.data || []
const batchData =state.allBatchNum.data || []
  
  const uniqueCompanyGsts = new Set(data.map((item) => item.company_gst));
  const uniqueNames = new Set(data.map((item) => item.company));
  const uniqueYears = new Set(data.map((item) => item.year));
  const uniqueMonths = new Set(data.map((item) => item.month));
  const uniqueBatchNums = new Set(batchData.map((item) => item));
  const uniqueInvoiceNum = new Set(data.map((item) => item.invoice_num));
  const uniqueCustomerGST = new Set(data.map((item) => item.customer_gst));
  console.log("uniqueBatchNums", batchData);
  const handleChange = () => {
    const values = form.getFieldsValue();
    const {
      company_gst,
      company,
      year,
      month,
      batch_num,
      invoice_num,
      customer_gst,
      type,
    } = values;
    const selectedValues = {
      company_gst,
      company,
      year,
      month,
      batch_num,
      invoice_num,
      customer_gst,
      type,
    };
    const queryParams = Object.entries(selectedValues)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    console.log("queryParams", queryParams);
    dispatch(fetchData(queryParams));

  };

  const onFinish = () => {
    setDataTable(true);
  };
  const onClose = () => {
    form.resetFields(); 
    const queryParams = ""; 
    dispatch(fetchData(queryParams));
    setDataTable(false);
  };


 
  useEffect(() => {
    const uniqueKeys = new Set();

    const tableData = state.data.flat().reduce((result, item) => {
      const key = item.id;

      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push({
          key: item.id,
          invoice_num: item.invoice_num ?? "testing",
          date: item.date ?? "testing",
          company_gst: item.company_gst ?? "testing",
          company: item.company ?? "testing",
          batch_num: item.batch_num,
          month: item.month ?? "testing",
          year: item.year ?? "testing",
          quantity: item.quantity ?? "testing",
          net_product_value: item.net_product_value ?? "testing",
          total_tax: item.total_tax ?? "",
          destination:
            item.destination.replace(
              "D:/New folder (2)/Documents/Haleon/Project/Data/",
              ""
            ) ?? "",
        });
      }
      return result;
    }, []);
    setTableData(tableData);
  }, [state.data]);

  const columns = [
    {
      title: "Invoice Num",
      dataIndex: "invoice_num",
      key: "invoice_num",
      render: (text, record) => (
        <a
          href={record.destination.replace(
            "GlaxoSmithKline Asia Pvt Ltd.",
            "GlaxoSmithKline Asia Pvt Ltd"
          )}
          target="_blank"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Company GST",
      dataIndex: "company_gst",
      key: "company_gst",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Batch Num",
      dataIndex: "batch_num",
      key: "batch_num",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Net Product Value",
      dataIndex: "net_product_value",
      key: "net_product_value",
    },
    {
      title: "Total Tax",
      dataIndex: "total_tax",
      key: "total_tax",
    },
  ];

 
  const downloadXLSX = async (item) => {
    try {
      const datatype = item;
      const values = form.getFieldsValue();
      const {
        company_gst,
        company,
        year,
        month,
        batch_num,
        invoice_num,
        customer_gst,
       
      } = values;
      const queryParams = Object.entries({
        company_gst,
        company,
        year,
        month,
        batch_num,
        invoice_num,
        customer_gst,
        
      })
 
  
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
      

      const finalQueryString = `${datatype}&${queryParams}&format=excel`;
     
console.log(finalQueryString)
      
      dispatch(fetchDownloadData(finalQueryString));
    } catch (error) {
      console.error('Error in downloadXLSX:', error);
    }
  };

  const downloadPDFs = () => {
    const pdfLinks = tabledata.map((item) =>
      item.destination.replace(
        "GlaxoSmithKline Asia Pvt Ltd.",
        "GlaxoSmithKline Asia Pvt Ltd"
      )
    ); 
    console.log(pdfLinks);

    pdfLinks.forEach((pdfLink, index) => {
      const link = document.createElement("a");
      link.href = pdfLink;
      link.target = "_blank";
      link.download = `${tabledata[index].invoice_num}.pdf`;
      link.click();
    });
  };
  

  return (
    <div>
      <div>
        <header>
          <div className="container">
            <nav>
              <div className="logo py-3">
                <img src="/logo-white.png" alt="" />
              </div>
              <div className="page-nav">
                <ul className="mb-0">
                  <li>
                    <a href="/">How to use</a>
                  </li>
                  <li>
                    <a href="">About Us</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </header>

        <div className="filter-section mt-5">
          <div className="container">
            <div className="filter">
              <h2>Search Record</h2>
              <div className="form-wrapper">
                <h4 className="heading">Search Invoice Record</h4>

               <div className="form-cover">
      <Form
        form={form}
        name="horizontal_login"
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="row">
          <div className="col-md-4">
            <Form.Item name="company_gst" label="GSKCH/HUL GST">
              <Select
                mode="multiple"
                placeholder="Select GSKCH/HUL GST"
                onChange={handleChange}
              >
                {Array.from(uniqueCompanyGsts).map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-4">
            <Form.Item name="company" label="Name">
              <Select
                mode="multiple"
                placeholder="Select Name"
                onChange={handleChange}
              >
                {Array.from(uniqueNames).map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-4">
            <Form.Item name="year" label="Year">
              <Select
                mode="multiple"
                placeholder="Select Year"
                onChange={handleChange}
              >
                {Array.from(uniqueYears).map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-4">
            <Form.Item name="month" label="Month">
              <Select
                mode="multiple"
                placeholder="Select Month"
                onChange={handleChange}
              >
                {Array.from(uniqueMonths).map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-4">
            <Form.Item name="batch_num" label="Batch Num">
              <Select
                mode="multiple"
                placeholder="Select Batch Num"
                onChange={handleChange}
              >
                {Array.from(uniqueBatchNums).map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-4">
            <Form.Item name="invoice_num" label="Invoice Num">
              <Select
                mode="multiple"
                placeholder="Select Invoice Num"
                onChange={handleChange}
              >
                {Array.from(uniqueInvoiceNum).map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
         
          <div className="col-md-4">
            <Form.Item name="customer_gst" label="Customer GST">
              <Select
                mode="multiple"
                placeholder="Select Customer GST"
                onChange={handleChange}
              >
                {Array.from(uniqueCustomerGST).map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-4">
            <div className="button-wrapper mt-4">
              <Button className="btn" type="primary" htmlType="submit">
                SEARCH
              </Button>
              <Button
                className="btn-trans ms-3"
                type="primary"
                htmlType="reset"
                onClick={onClose}
              >
                CLEAR FILTER
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
              </div>
            </div>

            <div
              className={dataTable ? "table-wrapper" : "table-wrapper d-none"}
            >
              <div className="heading">
                <div className="wrapper d-flex align-content-center justify-content-between px-3 mt-5">
                  {state.isLoadingData ? (
                    <p>Loading...</p>
                  ) : (
                    <h5>Showing {tabledata.length || 0} Results Found</h5>
                  )}
                  <h5>
                    Export Results:
                    <Button
                      type="primary"
                      onClick={() => downloadXLSX("Summary")}
                    >
                      Download Summary
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => downloadXLSX("Detailed")}
                    >
                      Download Master
                    </Button>{" "}
                    <Button type="primary" onClick={downloadPDFs}>
                      Download PDFs
                    </Button>
                  </h5>
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={tabledata}
                rowKey={(record) => record.key}
                scroll={{ x: 1300 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

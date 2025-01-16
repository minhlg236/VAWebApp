import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MainLayout from "../components/MainLayout";

const { Title } = Typography;

const licenseKey =
  "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzczMzExOTksImp0aSI6ImQ1MTEwZmQzLWFmM2YtNGZiYS1iOWQyLWYwMDk4OWI0NjE2ZSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjA1ZjNiYTc5In0.k8ebruq03MuqKM_UHF7qLwhru5ArgHu1x8w4U8ipPfJ6uZxr-j_6lS35RvVQ8U0ee8OVbs8Nb4uwCjR8GQIjIg";

const CLOUD_NAME = "dpzzzifpa";
const UPLOAD_PRESET = "vegetarian assistant";

const CreateArticle = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [articleImages, setArticleImages] = useState([]);

  const authorId =
    parseInt(localStorage.getItem("roleId")) === 5
      ? localStorage.getItem("userId")
      : null;

  const uploadImageToCloudinary = async (file) => {
    if (!file) return "";
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      message.error("Không thể upload ảnh. Vui lòng thử lại.");
      return "";
    }
  };

  const handleCreateArticle = async (values) => {
    if (!authorId) {
      message.error("Bạn không có quyền tạo bài viết!");
      return;
    }

    if (!values.title || !content) {
      message.error("Vui lòng điền đầy đủ tiêu đề và nội dung bài viết!");
      return;
    }

    const uploadedImages = await Promise.all(
      articleImages.map((file) => uploadImageToCloudinary(file))
    );

    const articlePayload = {
      articleId: 0,
      title: values.title,
      content,
      status: "accepted",
      authorId: parseInt(authorId),
      articleImages: uploadedImages.filter((url) => url),
    };

    try {
      await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articles/createArticleByNutritionist",
        articlePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      message.success("Tạo bài viết thành công!");
      navigate("/articles-management");
    } catch (error) {
      console.error("Lỗi trong quá trình tạo bài viết:", error);
      message.error("Không thể kết nối tới server. Vui lòng thử lại sau.");
    }
  };

  const handleAddImage = (file) => setArticleImages([...articleImages, file]);

  class CustomUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    async upload() {
      const data = new FormData();
      const file = await this.loader.file;

      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      return {
        default: result.secure_url,
      };
    }

    abort() {
      console.log("Upload bị hủy");
    }
  }

  return (
    <MainLayout title="Tạo Bài Viết">
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col span={18}>
          <Card
            title={<Title level={3}>Tạo Bài Viết Mới</Title>}
            bordered={false}
          >
            <Form form={form} onFinish={handleCreateArticle} layout="vertical">
              <Form.Item
                label="Tiêu đề bài viết"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiêu đề bài viết!",
                  },
                ]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>

              <Form.Item label="Nội dung bài viết" required>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    licenseKey,
                    extraPlugins: [
                      function CustomPlugin(editor) {
                        editor.plugins.get(
                          "FileRepository"
                        ).createUploadAdapter = (loader) => {
                          return new CustomUploadAdapter(loader);
                        };
                      },
                    ],
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                      "|",
                      "imageUpload",
                      "undo",
                      "redo",
                    ],
                  }}
                  data={content}
                  onChange={(event, editor) => setContent(editor.getData())}
                />
              </Form.Item>

              <Form.Item label="">
                <Upload
                  listType="picture"
                  multiple
                  beforeUpload={(file) => {
                    handleAddImage(file);
                    return false;
                  }}
                ></Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Tạo Bài Viết
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default CreateArticle;

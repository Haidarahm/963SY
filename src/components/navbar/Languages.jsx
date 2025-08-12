import React from "react";
import { FaGlobe } from "react-icons/fa";
import { Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLanguage } from "../../context/LanguageContext";

const Languages = () => {
  const { languages, currentLanguage, changeLanguage } = useLanguage();

  const menu = (
    <Menu onClick={({ key }) => changeLanguage(Number(key))}>
      {languages.map((lang) => (
        <Menu.Item key={lang.id}>{lang.name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" arrow>
      <div className="language-selector " style={{ cursor: "pointer" }}>
        <Space>
          <FaGlobe />
          {currentLanguage}
          <DownOutlined />
        </Space>
      </div>
    </Dropdown>
  );
};

export default Languages;

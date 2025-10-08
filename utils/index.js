const fs = require("fs");
const path = require("path");

export function getSidebar() {
  const docsPath = path.join(__dirname, "../src");
  const sidebar = {};

  const topLevelDirs = fs.readdirSync(docsPath).filter((file) => {
    const filePath = path.join(docsPath, file);
    return fs.statSync(filePath).isDirectory();
  });

  topLevelDirs.forEach((dir) => {
    const dirPath = path.join(docsPath, dir);
    sidebar[`/${dir}/`] = generateSidebarItems(dirPath, dir);
  });
  return sidebar;
}

function generateSidebarItems(dirPath, basePath = "") {
  const items = [];
  const files = fs.readdirSync(dirPath);

  files.sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    const name = file.replace(".md", "");
    const relativePath = path.join(basePath, file);

    if (stat.isDirectory()) {
      const children = generateSidebarItems(filePath, relativePath);
      // 查找该文件夹下是否有index.md，如果有，则作为链接
      const indexFile = children.find((child) => child.isIndex);
      const link = indexFile ? indexFile.link : undefined;

      const group = {
        text: formatTitle(file),
        collapsed: false,
        items: children.filter((child) => !child.isIndex), // 过滤掉index.md项
      };

      if (link) {
        group.link = link;
      }

      items.push(group);
    } else if (file.endsWith(".md")) {
      const item = {
        text: formatTitle(name),
        link: `/${relativePath.replace(/\\/g, "/").replace(".md", "")}`,
      };

      // 如果是index.md，我们标记为isIndex
      if (file === "index.md") {
        item.isIndex = true;
      } else {
        items.push(item);
      }
    }
  }
  return items;
}

function formatTitle(str) {
  //   if (!str || str === "index") return "首页";

  return str;
  // .replace(/[-_]/g, " ")
  // .replace(/\b\w/g, (l) => l.toUpperCase())
  // .trim();
}

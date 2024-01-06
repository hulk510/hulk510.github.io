const fs = require("fs");

function generatePost() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const file_name = `${year}-${month}-${day}-${Math.random()
    .toString(36)
    .slice(-8)}.md`;
  const file_path = `./_draft/${file_name}`;
  const title = "作成中";

  const content = `---
title: ${title}
toc: false
---`;

  fs.writeFile(file_path, content, (err) => {
    if (err) throw err;
    console.log(`Created ${file_path}`);
  });
}

generatePost();

export function letterToNumber(letters: string) {
  let total = 0;
  const length = letters.length;

  for (let i = 0; i < length; i++) {
    const char = letters.toLocaleUpperCase()[i];
    const value = char.charCodeAt(0) - 'A'.charCodeAt(0); // 获取字母位置（A -> 0, B -> 1, ...）

    // 计算位置
    // 因为是类似26进制的方式，所以我们需要考虑到字母的位数
    total = total * 26 + value; // 逐位计算
  }

  return total;
}

export const getIndexes = (image: string) => {
  const RowIndex = Number(/[0-9]\d*/.exec(image)![0]) - 1;
  const ColIndex = letterToNumber(/[A-Za-z]/.exec(image)![0]);

  if (isNaN(RowIndex) || isNaN(ColIndex)) {
    console.log('RowIndex or ColIndex is not a number', {
      image,
      RowIndex,
      ColIndex,
    });
  }

  return {
    RowIndex,
    ColIndex,
  };
};

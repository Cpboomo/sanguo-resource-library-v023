# 全卡共用结构 v025

164张卡：129英雄、32小兵、3资源卡，统一使用313×473透明画布。

| 层 | 文件 | z | 复用 |
| --- | --- | --- | --- |
| 米白底板与黑色外轮廓 | shared/card-base-ivory-v025.png | 10 | 全部164张 |
| 黑色尾页 | shared/card-footer-black-v025.png | 15 | 全部164张 |
| 品级色边框与分隔带 | shared/card-frame-{C,B,A,S,U}-v025.png | 20 | 按品级共用 |
| 人物或资源主体 | manifest.json中的recipe | 40 | 同素材引用 |
| 角标 | manifest.json中的recipe | 60起 | 同图标引用 |
| 透明标题 | manifest.json中的recipe | 70 | 独立标题 |

底板、尾页、边框均以原尺寸放在(0,0)。按z从小到大，以RGBA alpha叠加；其他组件使用recipe中的x、y、width、height，缩放采用Lanczos。

品级色仅用于边框和卡面与尾页之间的分隔带；不显示评级字母。C绿、B蓝、A紫、S橙、U红。米白卡面、黑色尾页、外轮廓和尺寸不随卡牌类型改变。

manifest.json保存组件ID、文件路径、SHA256及每张卡的完整配方；docs/assembly-instances.csv可用于批量导入。assembled/是同一配方离线生成的成品。validation.json逐像素验证全部配方与成品一致。

土块、粮仓已拆出透明主体和透明标题，共用同一底板、尾页和品级色边框；资源右上角共用道具图标。

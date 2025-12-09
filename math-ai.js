// AI助手逻辑 - 模拟微积分AI

document.addEventListener('DOMContentLoaded', function() {
    // 初始化AI聊天
    initAIChat();
});

// 初始化AI聊天
function initAIChat() {
    const sendButton = document.getElementById('send-message');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    if (!sendButton) return;
    
    // 发送消息
    sendButton.addEventListener('click', sendMessage);
    
    // 按Enter键发送消息
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 快捷问题
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            userInput.value = this.textContent;
            sendMessage();
        });
    });
    
    // 发送消息函数
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // 添加用户消息到聊天框
        addMessage(message, 'user');
        
        // 清空输入框
        userInput.value = '';
        
        // 模拟AI思考
        setTimeout(() => {
            const aiResponse = getAIResponse(message);
            addMessage(aiResponse, 'ai');
            
            // 滚动到底部
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
    
    // 添加消息到聊天框
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let avatarIcon = 'fas fa-user';
        let senderName = '你';
        
        if (sender === 'ai') {
            avatarIcon = 'fas fa-robot';
            senderName = '微积分助手';
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-sender">${senderName}</div>
                <div class="message-text">${formatMessageText(text, sender)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 重新渲染数学公式
        if (window.MathJax) {
            MathJax.typeset([messageDiv.querySelector('.message-text')]);
        }
    }
    
    // 格式化消息文本
    function formatMessageText(text, sender) {
        if (sender === 'ai') {
            // 将数学表达式用\( \)包围
            text = text.replace(/\$\$(.*?)\$\$/g, '\\[$1\\]');
            text = text.replace(/\$(.*?)\$/g, '\\($1\\)');
            
            // 将步骤列表转换为HTML
            text = text.replace(/步骤(\d+):/g, '<strong>步骤$1:</strong>');
            
            // 将换行符转换为<br>
            text = text.replace(/\n/g, '<br>');
        }
        
        return text;
    }
}

// 获取AI响应
function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 检查是否包含积分计算
    if (lowerMessage.includes('∫') || lowerMessage.includes('积分') || 
        (lowerMessage.includes('计算') && (lowerMessage.includes('dx') || lowerMessage.includes('sin') || lowerMessage.includes('cos') || lowerMessage.includes('x^')))) {
        return handleIntegralCalculation(userMessage);
    }
    
    // 检查是否关于概念
    if (lowerMessage.includes('什么是不定积分') || lowerMessage.includes('不定积分的定义')) {
        return getIndefiniteIntegralExplanation();
    }
    
    if (lowerMessage.includes('什么是定积分') || lowerMessage.includes('定积分的定义')) {
        return getDefiniteIntegralExplanation();
    }
    
    if (lowerMessage.includes('微积分基本定理') || lowerMessage.includes('fundamental theorem')) {
        return getFundamentalTheoremExplanation();
    }
    
    // 检查是否关于历史
    if (lowerMessage.includes('牛顿') || lowerMessage.includes('莱布尼茨') || 
        lowerMessage.includes('历史') || lowerMessage.includes('谁发明')) {
        return getHistoryResponse(userMessage);
    }
    
    // 检查是否关于应用
    if (lowerMessage.includes('应用') || lowerMessage.includes('用途') || 
        lowerMessage.includes('有什么用') || lowerMessage.includes('作用')) {
        return getApplicationResponse();
    }
    
    // 默认响应
    return getDefaultResponse(userMessage);
}

// 处理积分计算
function handleIntegralCalculation(message) {
    // 提取积分表达式
    let expression = message;
    
    // 移除常见前缀
    const prefixes = ['计算', '求', '∫', '积分', '的积分', '不定积分', '定积分'];
    prefixes.forEach(prefix => {
        if (expression.includes(prefix)) {
            expression = expression.replace(prefix, '');
        }
    });
    
    expression = expression.trim();
    
    // 简单积分计算
    const integralResults = {
        'x': '$\\frac{x^2}{2} + C$',
        'x^2': '$\\frac{x^3}{3} + C$',
        'x^3': '$\\frac{x^4}{4} + C$',
        'x^n': '$\\frac{x^{n+1}}{n+1} + C$ (n ≠ -1)',
        'sin(x)': '$-\\cos(x) + C$',
        'cos(x)': '$\\sin(x) + C$',
        'e^x': '$e^x + C$',
        'a^x': '$\\frac{a^x}{\\ln a} + C$',
        '1/x': '$\\ln|x| + C$',
        'sec^2(x)': '$\\tan(x) + C$'
    };
    
    let result = integralResults[expression] || null;
    
    if (result) {
        return `计算 $\\int ${expression} \\, dx$：
        
结果是：${result}

步骤：
1. 识别被积函数为 ${expression}
2. 应用基本积分公式
3. 添加积分常数C`;
    } else {
        // 尝试匹配带系数的积分
        const coefficientMatch = expression.match(/^(\d*\.?\d+)?x(\^(\d+))?$/);
        if (coefficientMatch) {
            const coefficient = coefficientMatch[1] ? parseFloat(coefficientMatch[1]) : 1;
            const power = coefficientMatch[3] ? parseInt(coefficientMatch[3]) : 1;
            
            if (power === -1) {
                return `计算 $\\int ${expression} \\, dx$：
                
结果是：${coefficient === 1 ? '' : coefficient + ' '}$\\ln|x| + C$

步骤：
1. 提取系数 ${coefficient}
2. 应用公式 $\\int \\frac{1}{x} dx = \\ln|x| + C$
3. 乘以系数 ${coefficient}`;
            } else {
                const newPower = power + 1;
                const newCoefficient = coefficient / newPower;
                
                return `计算 $\\int ${expression} \\, dx$：
                
结果是：$${newCoefficient === 1 ? '' : newCoefficient.toFixed(2).replace('.00', '') + ' '}x^{${newPower}} + C$

步骤：
1. 应用幂函数积分公式：$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$
2. 这里 n = ${power}，所以 $\\int x^{${power}} dx = \\frac{x^{${power}+1}}{${power}+1} + C$
3. 乘以系数 ${coefficient}`;
            }
        }
        
        // 通用响应
        return `对于积分 $\\int ${expression} \\, dx$，我可以提供一般性指导：

1. 首先检查是否可以直接应用基本积分公式
2. 如果不是基本形式，考虑使用：
   - 换元积分法（适用于复合函数）
   - 分部积分法（适用于乘积函数）
   - 三角恒等式（适用于三角函数）

你能提供更多关于这个积分的上下文吗？比如它来自什么问题？`;
    }
}

// 获取不定积分解释
function getIndefiniteIntegralExplanation() {
    return `**什么是不定积分？**

不定积分，也称为原函数或反导数，是导数的逆运算。

**定义：**
如果函数 $F(x)$ 的导数是 $f(x)$，即 $F'(x) = f(x)$，那么 $F(x)$ 就是 $f(x)$ 的一个原函数。函数 $f(x)$ 的所有原函数的集合称为 $f(x)$ 的**不定积分**，记作：

$$\\int f(x) \\, dx = F(x) + C$$

其中 $C$ 是任意常数，称为积分常数。

**几何意义：**
不定积分表示一族函数曲线，这些曲线在每一点处都有相同的切线斜率。例如，$\\int 2x \\, dx = x^2 + C$ 表示所有形如 $y = x^2 + C$ 的抛物线，它们在任意点 $x$ 处的斜率都是 $2x$。

**例子：**
- $\\int 3x^2 \\, dx = x^3 + C$
- $\\int \\cos(x) \\, dx = \\sin(x) + C$
- $\\int e^x \\, dx = e^x + C$`;
}

// 获取定积分解释
function getDefiniteIntegralExplanation() {
    return `**什么是定积分？**

定积分是微积分中的核心概念，用于计算曲线下的面积或其他累积量。

**定义：**
设函数 $f(x)$ 在区间 $[a, b]$ 上有定义，将区间分割为 $n$ 个小区间，在每一个小区间上任取一点 $\\xi_i$，作和式：

$$\\sum_{i=1}^{n} f(\\xi_i) \\Delta x_i$$

当分割无限加细时，如果这个和式的极限存在，则称此极限为函数 $f(x)$ 在区间 $[a, b]$ 上的**定积分**，记作：

$$\\int_{a}^{b} f(x) \\, dx$$

**几何意义：**
当 $f(x) \\geq 0$ 时，定积分表示由曲线 $y = f(x)$，直线 $x = a$，$x = b$ 和 x 轴所围成的曲边梯形的面积。

**例子：**
$$\\int_{0}^{2} x^2 \\, dx = \\left[ \\frac{x^3}{3} \\right]_{0}^{2} = \\frac{8}{3} - 0 = \\frac{8}{3}$$

这表示曲线 $y = x^2$ 从 $x=0$ 到 $x=2$ 下的面积是 $\\frac{8}{3}$。`;
}

// 获取微积分基本定理解释
function getFundamentalTheoremExplanation() {
    return `**微积分基本定理**

微积分基本定理是微积分的核心，它建立了微分与积分之间的重要联系。

**第一基本定理：**
如果函数 $f(x)$ 在区间 $[a, b]$ 上连续，那么函数
$$F(x) = \\int_{a}^{x} f(t) \\, dt$$
在 $[a, b]$ 上可导，并且 $F'(x) = f(x)$。

这意味着积分是微分的逆运算：对函数积分再微分，就得到原函数。

**第二基本定理：**
如果函数 $f(x)$ 在区间 $[a, b]$ 上连续，且 $F(x)$ 是 $f(x)$ 的一个原函数，那么
$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$

这个定理告诉我们，要计算定积分，只需要找到被积函数的原函数，然后计算其在积分上下限的差值。

**例子：**
计算 $\\int_{1}^{2} 3x^2 \\, dx$
1. 找到 $3x^2$ 的一个原函数：$F(x) = x^3$
2. 计算 $F(2) - F(1) = 2^3 - 1^3 = 8 - 1 = 7$
3. 所以 $\\int_{1}^{2} 3x^2 \\, dx = 7$`;
}

// 获取历史响应
function getHistoryResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('牛顿') && lowerMessage.includes('莱布尼茨')) {
        return `**牛顿与莱布尼茨的贡献**

牛顿和莱布尼茨都是微积分的独立发明者，他们的方法各有特点：

**牛顿 (1643-1727)：**
- 在1665-1666年间发展出"流数术"
- 使用几何方法和无穷小量概念
- 主要关注物理应用，特别是力学和天体运动
-  notation: 用点表示导数（如 $\dot{x}$ 表示 x 对时间的导数）

**莱布尼茨 (1646-1716)：**
- 在1675-1676年间独立发明微积分
- 发展了完整的符号系统，沿用至今
- 引入了积分符号 $\\int$ 和微分符号 $d$
- 强调符号操作和形式规则

**优先权之争：**
两人及其支持者就微积分的发明权展开激烈争论。现在公认两人是独立发明的，但莱布尼茨的符号系统更为优雅，被广泛采用。

**影响：**
这场争论在一定程度上阻碍了英国和欧洲大陆数学家的交流，但最终莱布尼茨的符号成为标准，推动了微积分的广泛应用。`;
    }
    
    if (lowerMessage.includes('牛顿')) {
        return `**艾萨克·牛顿对微积分的贡献**

艾萨克·牛顿（1643-1727）是英国物理学家、数学家和天文学家，通常被认为是微积分的发明者之一。

**主要贡献：**
1. **流数术**：牛顿称微积分为"流数术"，将变量看作"流动的量"
2. **无穷小量**：使用无穷小量（他称为"消失的量"）概念
3. **物理应用**：将微积分应用于万有引力定律和运动定律
4. **二项式定理**：发展了广义二项式定理，用于幂级数展开

**牛顿的符号：**
牛顿用点表示导数，例如 $\dot{x}$ 表示 x 对时间的导数。这种 notation 在物理学中仍有使用。

**历史背景：**
牛顿在1665-1666年躲避瘟疫期间（剑桥关闭）做出了他最重要的数学发现，但直到1687年才在《自然哲学的数学原理》中正式发表。

有趣的是，牛顿非常不愿意发表他的工作，部分原因是他害怕批评和争论。`;
    }
    
    if (lowerMessage.includes('莱布尼茨')) {
        return `**戈特弗里德·威廉·莱布尼茨对微积分的贡献**

莱布尼茨（1646-1716）是德国哲学家、数学家，独立发明了微积分并发展了沿用至今的符号系统。

**主要贡献：**
1. **符号系统**：引入了积分符号 $\\int$（拉长的 S，表示求和）和微分符号 $d$
2. **形式规则**：建立了微分和积分的基本规则
3. **乘积法则**：发现了微分乘积法则：$d(uv) = u \\, dv + v \\, du$
4. **二进制系统**：发展了二进制算术，为现代计算机科学奠定基础

**莱布尼茨的符号：**
莱布尼茨的符号直观且富有启发性：
- $\\frac{dy}{dx}$ 表示 y 对 x 的导数
- $\\int f(x) dx$ 表示 f(x) 的积分
- 这种 notation 强调微积分作为代数运算

**影响：**
莱布尼茨的符号被欧洲大陆数学家广泛采用，推动了微积分的快速发展。他与牛顿的优先权之争是科学史上著名的争议之一。`;
    }
    
    if (lowerMessage.includes('谁发明') && lowerMessage.includes('积分符号')) {
        return `积分符号 $\\int$ 是由**戈特弗里德·威廉·莱布尼茨**发明的。

**符号的由来：**
莱布尼茨在1675年引入了积分符号 $\\int$，这是一个拉长的字母 S，代表拉丁语"summa"（求和）的首字母。这反映了积分作为求和的本质。

**历史背景：**
- 1675年10月29日，莱布尼茨在手稿中首次使用 $\\int$ 符号
- 他同时引入了微分符号 $d$
- 这些符号在1686年他发表的第一篇微积分论文中正式出现

**为什么这个符号重要：**
莱布尼茨的符号直观表达了积分作为无限求和的概念，比牛顿的 notation 更容易理解和操作，这极大地促进了微积分在欧洲大陆的传播和发展。

有趣的是，尽管牛顿和莱布尼茨独立发明了微积分，但莱布尼茨的符号系统最终成为国际标准，沿用至今。`;
    }
    
    return `**微积分简史**

微积分的发展经历了几个关键阶段：

1. **古希腊时期**（公元前3世纪）：阿基米德使用"穷竭法"计算面积和体积
2. **中世纪**：印度和阿拉伯数学家发展了无穷级数
3. **17世纪**：开普勒、卡瓦列里等人发展了不可分量原理
4. **1660年代**：牛顿发明"流数术"（微积分）
5. **1670年代**：莱布尼茨独立发明微积分，引入现代符号
6. **18世纪**：欧拉、伯努利家族等发展了微积分的应用
7. **19世纪**：柯西、黎曼等为微积分奠定严格基础

微积分是现代科学和工程的基石，没有它，我们就无法描述运动、变化和累积效应。`;
}

// 获取应用响应
function getApplicationResponse() {
    return `**微积分的应用**

微积分，特别是积分，在科学和工程的各个领域都有广泛应用：

**物理学：**
- 计算物体的质心、转动惯量
- 计算功和能量：$W = \\int F \\, dx$
- 电磁学：计算电场和磁场
- 热力学：计算热量传递

**工程学：**
- 计算曲线的长度：$L = \\int \\sqrt{1 + (dy/dx)^2} \\, dx$
- 计算曲面的面积
- 计算旋转体的体积：$V = \\pi \\int [f(x)]^2 \\, dx$
- 结构分析：计算应力和应变

**经济学：**
- 计算总收益和总成本
- 计算消费者剩余和生产者剩余
- 优化问题：最大化利润或最小化成本

**生物学和医学：**
- 计算种群增长
- 药物动力学：计算药物在体内的浓度随时间的变化
- 医学成像：CT和MRI使用积分变换重建图像

**统计学：**
- 计算概率：$P(a \\leq X \\leq b) = \\int_a^b f(x) \\, dx$
- 计算期望值和方差

**日常生活中的例子：**
1. **汽车里程表**：通过对速度积分得到行驶距离
2. **水电费**：通过对流量积分得到总用水/用电量
3. **储蓄利息**：连续复利计算使用指数函数和积分

积分本质上是"累积"的数学语言，任何涉及累积、求和或总效应的问题都可能用到积分。`;
}

// 获取默认响应
function getDefaultResponse(message) {
    const responses = [
        `我主要专注于微积分相关问题。你可以问我关于：
        1. 定积分和不定积分的概念
        2. 积分计算和公式
        3. 微积分基本定理
        4. 牛顿和莱布尼茨的历史贡献
        5. 微积分的应用
        
        请尝试提出更具体的问题！`,
        
        `你好！我是微积分学习助手。我可以帮助你理解积分概念、计算积分、了解微积分历史。
        
        你刚刚问的是："${message}"
        
        如果你想学习积分，可以从这些开始：
        1. "什么是不定积分？"
        2. "如何计算∫x²dx？"
        3. "微积分基本定理是什么？"
        4. "牛顿和莱布尼茨分别有什么贡献？"`,
        
        `关于"${message}"，这是一个有趣的问题！
        
        作为微积分助手，我特别擅长：
        - 解释数学概念和定义
        - 演示计算步骤
        - 提供可视化示例
        - 讲述历史背景故事
        
        你能把你的问题说得更具体一些吗？比如，你是想了解概念、计算方法，还是历史背景？`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}
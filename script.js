// 主JavaScript文件 - 处理页面交互

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏滚动效果
    initNavbarScroll();
    
    // 初始化积分计算器
    initIntegralCalculator();
    
    // 初始化历史测试
    initHistoryQuiz();
    
    // 初始化微积分基本定理动画
    initFundamentalTheoremAnimation();
    
    // 初始化定积分可视化
    initDefiniteIntegralVisualization();
    
    // 平滑滚动到锚点
    initSmoothScrolling();
    
    // 更新MathJax渲染
    if (window.MathJax) {
        MathJax.typeset();
    }
});

// 导航栏滚动效果
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            navbar.style.transform = 'translateY(0)';
        }
        
        // 添加背景色
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(67, 97, 238, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 平滑滚动到锚点
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 移动设备上关闭导航菜单
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// 初始化积分计算器
function initIntegralCalculator() {
    const calculateBtn = document.getElementById('calculate-integral');
    const integralInput = document.getElementById('integral-input');
    const resultDisplay = document.getElementById('integral-result');
    const stepDisplay = document.getElementById('step-by-step');
    
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', function() {
        const expression = integralInput.value.trim();
        
        if (!expression) {
            resultDisplay.innerHTML = '请输入积分表达式';
            return;
        }
        
        // 模拟计算过程
        resultDisplay.innerHTML = '计算中...';
        stepDisplay.innerHTML = '';
        
        setTimeout(() => {
            const result = calculateIntegral(expression);
            resultDisplay.innerHTML = result.formattedResult;
            
            // 显示步骤
            if (result.steps && result.steps.length > 0) {
                let stepsHtml = '<h6>计算步骤：</h6><ol>';
                result.steps.forEach(step => {
                    stepsHtml += `<li>${step}</li>`;
                });
                stepsHtml += '</ol>';
                stepDisplay.innerHTML = stepsHtml;
            }
            
            // 重新渲染数学公式
            if (window.MathJax) {
                MathJax.typeset([resultDisplay, stepDisplay]);
            }
        }, 500);
    });
    
    // 按Enter键触发计算
    integralInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });
}

// 积分计算函数（模拟）
function calculateIntegral(expression) {
    // 简单的积分计算模拟
    const integralMap = {
        'x': 'x^2/2 + C',
        'x^2': 'x^3/3 + C',
        'x^3': 'x^4/4 + C',
        'sin(x)': '-cos(x) + C',
        'cos(x)': 'sin(x) + C',
        'e^x': 'e^x + C',
        '1/x': 'ln|x| + C',
        'x^2 dx': 'x^3/3 + C',
        'sin(x) dx': '-cos(x) + C',
        'cos(x) dx': 'sin(x) + C',
        'e^x dx': 'e^x + C'
    };
    
    // 清理表达式
    let cleanExpr = expression.toLowerCase().replace(/\s+/g, '');
    
    // 移除末尾的"dx"如果存在
    if (cleanExpr.endsWith('dx')) {
        cleanExpr = cleanExpr.substring(0, cleanExpr.length - 2);
    }
    
    // 查找匹配的积分
    let result = integralMap[cleanExpr] || integralMap[expression] || `∫ ${expression} dx`;
    
    // 生成步骤
    let steps = [];
    
    if (cleanExpr === 'x^2') {
        steps = [
            '使用幂函数积分公式：∫ x^n dx = x^(n+1)/(n+1) + C',
            '这里 n = 2，所以 ∫ x^2 dx = x^(2+1)/(2+1) + C',
            '简化得：x^3/3 + C'
        ];
    } else if (cleanExpr === 'sin(x)') {
        steps = [
            '基本积分公式：∫ sin(x) dx = -cos(x) + C'
        ];
    } else if (cleanExpr === 'cos(x)') {
        steps = [
            '基本积分公式：∫ cos(x) dx = sin(x) + C'
        ];
    } else if (cleanExpr === 'e^x') {
        steps = [
            '基本积分公式：∫ e^x dx = e^x + C'
        ];
    } else if (cleanExpr === '1/x') {
        steps = [
            '基本积分公式：∫ 1/x dx = ln|x| + C'
        ];
    } else {
        steps = [
            '应用适当的积分方法（幂函数法则、换元法、分部积分法等）',
            '计算原函数',
            '添加积分常数C'
        ];
    }
    
    // 格式化结果
    let formattedResult = `\\[ \\int ${expression} \\, dx = ${result} \\]`;
    
    return {
        formattedResult,
        steps
    };
}

// 初始化历史测试
function initHistoryQuiz() {
    const optionButtons = document.querySelectorAll('.btn-option');
    const feedbackDiv = document.getElementById('quiz-feedback');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            // 移除其他按钮的选中状态
            optionButtons.forEach(btn => {
                btn.classList.remove('btn-success', 'btn-danger', 'active');
                btn.classList.add('btn-outline-primary');
            });
            
            // 设置当前按钮状态
            if (isCorrect) {
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-success');
                feedbackDiv.innerHTML = '<div class="alert alert-success">✓ 回答正确！积分符号"∫"确实是莱布尼茨发明的。</div>';
            } else {
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-danger');
                feedbackDiv.innerHTML = '<div class="alert alert-danger">✗ 回答错误。积分符号"∫"是莱布尼茨发明的，他引入了这个优雅的符号来表示求和。</div>';
            }
        });
    });
}

// 初始化微积分基本定理动画
function initFundamentalTheoremAnimation() {
    const showAnimationBtn = document.getElementById('show-animation');
    
    if (!showAnimationBtn) return;
    
    showAnimationBtn.addEventListener('click', function() {
        const animationDiv = document.getElementById('fundamental-visual');
        animationDiv.innerHTML = `
            <div class="animation-content">
                <h5>微积分基本定理动画演示</h5>
                <div class="animation-canvas-container">
                    <canvas id="ft-canvas" width="600" height="300"></canvas>
                </div>
                <div class="animation-controls mt-3">
                    <button id="restart-animation" class="btn btn-sm btn-primary">重新开始</button>
                    <button id="pause-animation" class="btn btn-sm btn-warning ms-2">暂停/继续</button>
                </div>
                <div class="animation-explanation mt-3">
                    <p>动画展示了定积分与不定积分的关系：曲边梯形的面积变化率等于曲线的高度。</p>
                </div>
            </div>
        `;
        
        // 开始动画
        startFundamentalTheoremAnimation();
        
        // 重新绑定按钮事件
        document.getElementById('restart-animation').addEventListener('click', startFundamentalTheoremAnimation);
        document.getElementById('pause-animation').addEventListener('click', toggleAnimation);
    });
}

// 开始微积分基本定理动画
function startFundamentalTheoremAnimation() {
    const canvas = document.getElementById('ft-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let isPaused = false;
    
    // 动画参数
    let a = 0.5;  // 积分下限
    let b = 3.5;  // 积分上限
    let currentX = a;
    let area = 0;
    
    // 函数定义
    function f(x) {
        return 0.5 * Math.sin(x) + 1;
    }
    
    // 绘制函数
    function drawFunction() {
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制坐标轴
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // x轴
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        
        // y轴
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        
        ctx.stroke();
        
        // 绘制刻度
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        
        // x轴刻度
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / 10) * graphWidth;
            const value = a + (i / 10) * (b - a);
            ctx.fillText(value.toFixed(1), x - 10, height - padding + 20);
            ctx.beginPath();
            ctx.moveTo(x, height - padding - 5);
            ctx.lineTo(x, height - padding + 5);
            ctx.stroke();
        }
        
        // y轴刻度
        for (let i = 0; i <= 5; i++) {
            const y = height - padding - (i / 5) * graphHeight;
            ctx.fillText(i.toFixed(1), padding - 25, y + 5);
            ctx.beginPath();
            ctx.moveTo(padding - 5, y);
            ctx.lineTo(padding + 5, y);
            ctx.stroke();
        }
        
        // 绘制函数曲线
        ctx.beginPath();
        ctx.strokeStyle = '#4361ee';
        ctx.lineWidth = 2;
        
        for (let i = 0; i <= graphWidth; i++) {
            const x = a + (i / graphWidth) * (b - a);
            const y = f(x);
            const graphX = padding + i;
            const graphY = height - padding - (y / 2) * graphHeight;
            
            if (i === 0) {
                ctx.moveTo(graphX, graphY);
            } else {
                ctx.lineTo(graphX, graphY);
            }
        }
        
        ctx.stroke();
        
        // 绘制当前x位置的垂直线和面积
        if (currentX <= b) {
            const graphX = padding + ((currentX - a) / (b - a)) * graphWidth;
            const yValue = f(currentX);
            const graphY = height - padding - (yValue / 2) * graphHeight;
            
            // 绘制垂直线
            ctx.beginPath();
            ctx.strokeStyle = '#e63946';
            ctx.lineWidth = 2;
            ctx.moveTo(graphX, height - padding);
            ctx.lineTo(graphX, graphY);
            ctx.stroke();
            
            // 填充面积
            ctx.beginPath();
            ctx.fillStyle = 'rgba(67, 97, 238, 0.3)';
            ctx.moveTo(padding, height - padding);
            
            for (let i = 0; i <= graphX - padding; i++) {
                const x = a + (i / graphWidth) * (b - a);
                const y = f(x);
                const currentGraphX = padding + i;
                const currentGraphY = height - padding - (y / 2) * graphHeight;
                ctx.lineTo(currentGraphX, currentGraphY);
            }
            
            ctx.lineTo(graphX, height - padding);
            ctx.closePath();
            ctx.fill();
            
            // 显示当前面积值
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.fillText(`面积 A(x) = ${area.toFixed(3)}`, graphX + 10, graphY - 10);
            
            // 显示当前x值
            ctx.fillText(`x = ${currentX.toFixed(2)}`, graphX - 20, height - padding + 35);
            
            // 显示函数值
            ctx.fillText(`f(x) = ${yValue.toFixed(3)}`, graphX + 10, graphY + 20);
            
            // 更新当前x和面积
            if (!isPaused) {
                currentX += 0.02;
                area += f(currentX) * 0.02;
                
                if (currentX > b) {
                    currentX = b;
                }
            }
        } else {
            // 显示最终结果
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.fillText(`最终面积: A(${b.toFixed(1)}) = ${area.toFixed(3)}`, width / 2 - 100, padding + 30);
            ctx.fillText(`微积分基本定理: A'(x) = f(x)`, width / 2 - 100, padding + 60);
        }
        
        if (currentX < b || isPaused) {
            animationId = requestAnimationFrame(drawFunction);
        }
    }
    
    // 开始动画
    drawFunction();
    
    // 暂停/继续动画
    window.toggleAnimation = function() {
        isPaused = !isPaused;
        if (!isPaused) {
            drawFunction();
        }
    };
    
    // 重新开始动画
    window.restartAnimation = function() {
        cancelAnimationFrame(animationId);
        currentX = a;
        area = 0;
        isPaused = false;
        drawFunction();
    };
}

// 初始化定积分可视化
function initDefiniteIntegralVisualization() {
    const updateBtn = document.getElementById('update-graph');
    
    if (!updateBtn) return;
    
    updateBtn.addEventListener('click', drawDefiniteIntegral);
    
    // 初始绘制
    drawDefiniteIntegral();
}

// 绘制定积分可视化
function drawDefiniteIntegral() {
    const canvas = document.getElementById('definite-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 获取用户输入
    const funcInput = document.getElementById('function-input').value;
    const lowerLimit = parseFloat(document.getElementById('lower-limit').value);
    const upperLimit = parseFloat(document.getElementById('upper-limit').value);
    
    // 解析函数
    let f;
    try {
        f = new Function('x', `return ${funcInput.replace('^', '**')};`);
    } catch (e) {
        alert('函数输入有误，请检查语法。使用 x 作为变量，例如：x^2, sin(x), cos(x)');
        return;
    }
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制坐标轴
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // x轴
    ctx.moveTo(30, height / 2);
    ctx.lineTo(width - 30, height / 2);
    
    // y轴
    ctx.moveTo(width / 2, 30);
    ctx.lineTo(width / 2, height - 30);
    
    ctx.stroke();
    
    // 绘制刻度
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    
    // 确定x范围
    const xMin = Math.min(lowerLimit, upperLimit) - 1;
    const xMax = Math.max(lowerLimit, upperLimit) + 1;
    const xRange = xMax - xMin;
    
    // 确定y范围
    let yMin = Infinity;
    let yMax = -Infinity;
    
    // 采样函数值以确定y范围
    for (let i = 0; i <= width; i++) {
        const x = xMin + (i / width) * xRange;
        try {
            const y = f(x);
            if (!isNaN(y) && isFinite(y)) {
                yMin = Math.min(yMin, y);
                yMax = Math.max(yMax, y);
            }
        } catch (e) {
            // 忽略计算错误
        }
    }
    
    // 如果y范围无效，使用默认值
    if (!isFinite(yMin) || !isFinite(yMax) || yMin === yMax) {
        yMin = -2;
        yMax = 2;
    }
    
    const yRange = yMax - yMin;
    
    // 坐标转换函数
    function toCanvasX(x) {
        return 30 + ((x - xMin) / xRange) * (width - 60);
    }
    
    function toCanvasY(y) {
        return height - 30 - ((y - yMin) / yRange) * (height - 60);
    }
    
    // 绘制函数曲线
    ctx.beginPath();
    ctx.strokeStyle = '#4361ee';
    ctx.lineWidth = 2;
    
    let started = false;
    
    for (let i = 0; i <= width; i++) {
        const x = xMin + (i / width) * xRange;
        try {
            const y = f(x);
            if (!isNaN(y) && isFinite(y)) {
                const canvasX = toCanvasX(x);
                const canvasY = toCanvasY(y);
                
                if (!started) {
                    ctx.moveTo(canvasX, canvasY);
                    started = true;
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            } else {
                started = false;
            }
        } catch (e) {
            started = false;
        }
    }
    
    ctx.stroke();
    
    // 绘制积分区域
    if (lowerLimit !== upperLimit) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(67, 97, 238, 0.3)';
        
        // 从左边界开始
        const startX = Math.max(xMin, Math.min(lowerLimit, upperLimit));
        const endX = Math.min(xMax, Math.max(lowerLimit, upperLimit));
        
        // 移动到曲线起点
        const startCanvasX = toCanvasX(startX);
        const startCanvasY = toCanvasY(f(startX));
        ctx.moveTo(startCanvasX, startCanvasY);
        
        // 沿曲线绘制到终点
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
            const x = startX + (i / steps) * (endX - startX);
            const y = f(x);
            const canvasX = toCanvasX(x);
            const canvasY = toCanvasY(y);
            ctx.lineTo(canvasX, canvasY);
        }
        
        // 向下到x轴
        ctx.lineTo(toCanvasX(endX), toCanvasY(0));
        
        // 沿x轴回到起点
        ctx.lineTo(toCanvasX(startX), toCanvasY(0));
        
        // 关闭路径并填充
        ctx.closePath();
        ctx.fill();
        
        // 绘制积分边界
        ctx.beginPath();
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 2;
        
        // 左边界
        ctx.moveTo(toCanvasX(lowerLimit), toCanvasY(0));
        ctx.lineTo(toCanvasX(lowerLimit), toCanvasY(f(lowerLimit)));
        
        // 右边界
        ctx.moveTo(toCanvasX(upperLimit), toCanvasY(0));
        ctx.lineTo(toCanvasX(upperLimit), toCanvasY(f(upperLimit)));
        
        ctx.stroke();
        
        // 计算近似积分值（黎曼和）
        let integral = 0;
        const n = 100; // 分割数
        const dx = (upperLimit - lowerLimit) / n;
        
        for (let i = 0; i < n; i++) {
            const x = lowerLimit + (i + 0.5) * dx; // 中点黎曼和
            try {
                integral += f(x) * dx;
            } catch (e) {
                // 忽略计算错误
            }
        }
        
        // 显示积分值
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.fillText(`∫${funcInput} dx 从 ${lowerLimit} 到 ${upperLimit}`, 10, 20);
        ctx.fillText(`近似值: ${integral.toFixed(4)}`, 10, 40);
    }
    
    // 绘制坐标轴标签
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('x', width - 20, height / 2 + 20);
    ctx.fillText('y', width / 2 - 20, 20);
}
export const KLINE_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生命之树 · 人生轨迹K线图</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Noto Serif SC", "Source Han Serif", serif;
            background: rgba(250, 248, 242, 0.95);
            color: #1a1a1a;
            line-height: 1.6;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .container {
            background: transparent;
            border: none;
            padding: 0;
        }
        
        .header {
            margin-bottom: 40px;
            text-align: left;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            padding-bottom: 20px;
        }
        
        .title {
            font-size: 28px;
            font-weight: 400;
            letter-spacing: 2px;
            margin-bottom: 8px;
            color: #1a1a1a;
        }
        
        .subtitle {
            font-size: 14px;
            color: #666;
            font-weight: 300;
            letter-spacing: 1px;
        }
        
        .description {
            font-size: 15px;
            color: #444;
            margin-top: 12px;
            max-width: 800px;
        }
        
        .chart-container {
            position: relative;
            width: 100%;
            height: 500px;
            margin: 40px 0 60px;
            background: transparent;
        }
        
        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
        
        .axis-label {
            position: absolute;
            font-size: 12px;
            color: #666;
            letter-spacing: 0.5px;
        }
        
        .x-axis-label {
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .y-axis-label {
            top: 50%;
            left: -40px;
            transform: translateY(-50%) rotate(-90deg);
            white-space: nowrap;
        }
        
        .sephiroth-dots {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .dot {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            border: 2px solid rgba(0, 0, 0, 0.7);
            cursor: pointer;
            transition: all 0.3s ease;
            pointer-events: auto;
        }
        
        .dot:hover {
            transform: translate(-50%, -50%) scale(1.5);
            z-index: 10;
        }
        
        .dot-tooltip {
            position: absolute;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0, 0, 0, 0.1);
            padding: 12px 16px;
            border-radius: 2px;
            font-size: 13px;
            min-width: 180px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 100;
        }
        
        .dot-tooltip h4 {
            font-weight: 500;
            margin-bottom: 4px;
            color: #1a1a1a;
        }
        
        .dot-tooltip p {
            color: #666;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .sephiroth-info {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
            margin-top: 60px;
            padding-top: 40px;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .sephiroth-card {
            padding: 16px;
            background: rgba(255, 255, 255, 0.6);
            border-left: 3px solid rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .sephiroth-card:hover {
            background: rgba(255, 255, 255, 0.9);
            transform: translateY(-2px);
        }
        
        .sephiroth-card h3 {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #1a1a1a;
        }
        
        .sephiroth-card .number {
            font-size: 12px;
            color: #888;
            margin-bottom: 4px;
            letter-spacing: 1px;
        }
        
        .sephiroth-card p {
            font-size: 13px;
            color: #555;
            line-height: 1.5;
        }
        
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            text-align: center;
            font-size: 13px;
            color: #888;
            letter-spacing: 1px;
        }
        
        .controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 25px;
        }
        
        .control-btn {
            padding: 8px 20px;
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.1);
            color: #444;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            letter-spacing: 1px;
        }
        
        .control-btn:hover {
            background: rgba(0, 0, 0, 0.08);
        }
        
        .phase-markers {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            bottom: -25px;
            pointer-events: none;
        }
        
        .phase-marker {
            font-size: 11px;
            color: #777;
            text-align: center;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">生命之树 · 人生轨迹K线图</h1>
            <div class="subtitle">Eastern Editorial Minimalism · 基于卡巴拉十个源质的能量波动</div>
            <p class="description">此K线图映射您在十个生命维度上的能量起伏，每个节点代表一个源质，连接线显示能量流动与生命阶段转折点。</p>
        </div>
        
        <div class="chart-container">
            <canvas id="klineChart"></canvas>
            <div class="axis-label x-axis-label">生命阶段 / 年龄周期</div>
            <div class="axis-label y-axis-label">生命能量维度 (1-10)</div>
            
            <div class="phase-markers">
                <div class="phase-marker">青年期 (20-30)</div>
                <div class="phase-marker">成熟期 (30-45)</div>
                <div class="phase-marker">收获期 (45-60)</div>
                <div class="phase-marker">智慧期 (60+)</div>
            </div>
            
            <div class="sephiroth-dots" id="sephirothDots"></div>
            <div class="dot-tooltip" id="dotTooltip"></div>
        </div>
        
        <div class="controls">
            <button class="control-btn" id="viewEnergyFlow">查看能量流</button>
            <button class="control-btn" id="viewKLine">查看K线图</button>
            <button class="control-btn" id="resetView">重置视图</button>
        </div>
        
        <div class="sephiroth-info" id="sephirothInfo"></div>
        
        <div class="footer">
            <p>生命之树牌阵解读 · 人生轨迹K线图</p>
            <p>每一个波动都是成长的轨迹，每一次转折都是灵魂的抉择</p>
        </div>
    </div>

    <script>
        // 生命之树源质数据
        const sephirothData = __SEPHIROTH_DATA__;
        
        // 源质描述
        const sephirothDescriptions = __SEPHIROTH_DESCRIPTIONS__;
        
        // K线数据生成：基于源质能量的线性插值与波动模拟
        const klineData = [];
        let prevClose = 5; // 初始基准能量

        // 1. 预处理关键点数据
        // 按年龄排序，确保插值逻辑正确
        const keyPoints = [...sephirothData].sort((a, b) => a.age - b.age);
        
        // 添加起始点（0岁）和终点（80岁）
        if (keyPoints[0].age > 0) {
            keyPoints.unshift({ age: 0, energy: 5, id: 'start' });
        }
        if (keyPoints[keyPoints.length - 1].age < 80) {
            // 终点能量回归平稳或延续最后一个源质的趋势
            keyPoints.push({ age: 80, energy: keyPoints[keyPoints.length - 1].energy, id: 'end' });
        }

        // 2. 逐年计算能量值
        for (let i = 0; i < 80; i++) {
            // 找到当前年龄 i 处于哪两个关键点之间
            let startPoint = keyPoints[0];
            let endPoint = keyPoints[keyPoints.length - 1];
            
            for (let j = 0; j < keyPoints.length - 1; j++) {
                if (i >= keyPoints[j].age && i < keyPoints[j+1].age) {
                    startPoint = keyPoints[j];
                    endPoint = keyPoints[j+1];
                    break;
                }
            }

            // 计算进度比例 (0~1)
            const progress = (i - startPoint.age) / (endPoint.age - startPoint.age);
            
            // 基础趋势能量（线性插值 + 缓动效果）
            // 使用余弦插值让过渡更平滑：(1 - Math.cos(progress * Math.PI)) / 2
            const easeProgress = (1 - Math.cos(progress * Math.PI)) / 2;
            const trendEnergy = startPoint.energy + (endPoint.energy - startPoint.energy) * easeProgress;
            
            // 确定今日开盘价 (连续性保证)
            const open = (i === 0) ? trendEnergy : prevClose;
            
            // 计算目标收盘价
            // 目标是让 close 围绕 trendEnergy 波动，但又保持向 trendEnergy 的回归力
            // volatility 应该受源质本身的性质影响，这里简化为固定波动或基于能量强度的波动
            const volatility = 0.3 + Math.abs(trendEnergy - 5) * 0.1; 
            
            // 随机扰动 (保留一点点随机性模拟生活的不确定性，但主要受趋势控制)
            // 如果希望完全确定性，可以去掉 Math.random()，或者用伪随机数生成器
            const noise = (Math.random() - 0.5) * volatility;
            
            // 收盘价 = 趋势值 + 扰动
            // 稍微平滑处理：当前趋势值占大头
            let close = trendEnergy + noise;
            
            // 关键事件标记
            let hasEvent = false;
            let eventSephiroth = null;
            
            // 检查是否正好是某个源质的关键年份
            const currentSep = sephirothData.find(sep => Math.abs(sep.age - i) < 1);
            if (currentSep) {
                hasEvent = true;
                eventSephiroth = currentSep.id;
                // 关键年份强制收敛到源质能量值，强调该源质的影响
                close = currentSep.energy; 
            }
            
            const high = Math.max(open, close) + Math.abs(noise) * 0.5;
            const low = Math.min(open, close) - Math.abs(noise) * 0.5;
            
            klineData[i] = { 
                open, 
                high, 
                low, 
                close, 
                age: i, 
                hasEvent, 
                eventSephiroth 
            };
            
            prevClose = close;
        }
        
        // 初始化Canvas
        const canvas = document.getElementById('klineChart');
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        
        // 设置Canvas尺寸
        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            ctx.scale(dpr, dpr);
            drawChart();
            createSephirahDots();
        }
        
        // 绘制K线图
        function drawChart(mode = 'kline') {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            // 清除画布
            ctx.clearRect(0, 0, width, height);
            
            // 绘制网格
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.lineWidth = 1;
            
            // 水平网格线
            for (let i = 1; i < 10; i++) {
                const y = height * 0.1 + (i / 10) * (height * 0.8);
                ctx.beginPath();
                ctx.moveTo(width * 0.05, y);
                ctx.lineTo(width * 0.95, y);
                ctx.stroke();
            }
            
            // 垂直网格线
            for (let i = 0; i < 8; i++) {
                const x = width * 0.05 + (i / 8) * (width * 0.9);
                ctx.beginPath();
                ctx.moveTo(x, height * 0.1);
                ctx.lineTo(x, height * 0.9);
                ctx.stroke();
            }
            
            if (mode === 'kline') {
                // 绘制K线
                const barWidth = width * 0.9 / klineData.length * 0.7;
                const xOffset = width * 0.05;
                const yScale = height * 0.8 / 8; // 能量范围2-10
                
                klineData.forEach((data, index) => {
                    const x = xOffset + (index / klineData.length) * (width * 0.9);
                    const openY = height * 0.9 - (data.open - 2) * yScale;
                    const closeY = height * 0.9 - (data.close - 2) * yScale;
                    const highY = height * 0.9 - (data.high - 2) * yScale;
                    const lowY = height * 0.9 - (data.low - 2) * yScale;
                    
                    // 判断涨跌
                    const isUp = data.close >= data.open;
                    
                    // 绘制影线
                    ctx.strokeStyle = isUp ? 'rgba(40, 120, 80, 0.7)' : 'rgba(180, 80, 80, 0.7)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x, highY);
                    ctx.lineTo(x, lowY);
                    ctx.stroke();
                    
                    // 绘制实体
                    ctx.fillStyle = isUp ? 'rgba(40, 120, 80, 0.3)' : 'rgba(180, 80, 80, 0.3)';
                    ctx.fillRect(x - barWidth/2, Math.min(openY, closeY), barWidth, Math.abs(closeY - openY));
                    
                    // 绘制边框
                    ctx.strokeStyle = isUp ? 'rgba(40, 120, 80, 0.8)' : 'rgba(180, 80, 80, 0.8)';
                    ctx.strokeRect(x - barWidth/2, Math.min(openY, closeY), barWidth, Math.abs(closeY - openY));
                    
                    // 标记关键事件
                    if (data.hasEvent) {
                        ctx.fillStyle = sephirothData.find(s => s.id === data.eventSephiroth).color;
                        ctx.beginPath();
                        ctx.arc(x, isUp ? Math.min(openY, closeY) : Math.max(openY, closeY), 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                
                // 绘制趋势线（简单移动平均）
                ctx.strokeStyle = 'rgba(160, 120, 80, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                const period = 5;
                for (let i = period; i < klineData.length; i++) {
                    let sum = 0;
                    for (let j = 0; j < period; j++) {
                        sum += klineData[i - j].close;
                    }
                    const avg = sum / period;
                    const x = xOffset + (i / klineData.length) * (width * 0.9);
                    const y = height * 0.9 - (avg - 2) * yScale;
                    
                    if (i === period) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            } else if (mode === 'energy') {
                // 绘制能量流图
                ctx.strokeStyle = 'rgba(100, 150, 200, 0.6)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                sephirothData.forEach((sep, index) => {
                    const x = width * 0.05 + (sep.age / 80) * (width * 0.9);
                    const y = height * 0.9 - (sep.energy - 2) * (height * 0.8 / 8);
                    
                    if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.stroke();
                
                // 绘制源质点
                sephirothData.forEach((sep, index) => {
                    const x = width * 0.05 + (sep.age / 80) * (width * 0.9);
                    const y = height * 0.9 - (sep.energy - 2) * (height * 0.8 / 8);
                    
                    ctx.fillStyle = sep.color;
                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                });
            }
            
            // 绘制坐标轴
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1.5;
            
            // Y轴
            ctx.beginPath();
            ctx.moveTo(width * 0.05, height * 0.1);
            ctx.lineTo(width * 0.05, height * 0.9);
            ctx.stroke();
            
            // X轴
            ctx.beginPath();
            ctx.moveTo(width * 0.05, height * 0.9);
            ctx.lineTo(width * 0.95, height * 0.9);
            ctx.stroke();
            
            // Y轴刻度
            ctx.fillStyle = '#666';
            ctx.font = '11px serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            
            for (let i = 2; i <= 10; i += 2) {
                const y = height * 0.9 - (i - 2) * (height * 0.8 / 8);
                ctx.fillText(i.toString(), width * 0.04, y);
            }
            
            // X轴刻度
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            for (let i = 0; i <= 80; i += 20) {
                const x = width * 0.05 + (i / 80) * (width * 0.9);
                ctx.fillText(i.toString(), x, height * 0.92);
            }
        }
        
        // 创建源质点
        function createSephirahDots() {
            const container = document.getElementById('sephirothDots');
            const tooltip = document.getElementById('dotTooltip');
            container.innerHTML = '';
            
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            sephirothData.forEach(sep => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.dataset.id = sep.id;
                
                const x = width * 0.05 + (sep.age / 80) * (width * 0.9);
                const y = height * 0.9 - (sep.energy - 2) * (height * 0.8 / 8);
                
                dot.style.left = x + 'px';
                dot.style.top = y + 'px';
                dot.style.backgroundColor = sep.color;
                
                // 鼠标悬停事件
                dot.addEventListener('mouseenter', (e) => {
                    showTooltip(dot, sep);
                });
                
                // 鼠标点击事件（移动端友好）
                dot.addEventListener('click', (e) => {
                    e.stopPropagation(); // 防止冒泡触发 document 点击关闭
                    showTooltip(dot, sep);
                });
                
                dot.addEventListener('mouseleave', () => {
                   // 仅在非点击状态下（或简单处理）隐藏，这里为了简单起见，点击和悬停都触发显示
                   // 实际交互可能需要更复杂的逻辑，比如点击锁定 tooltip
                   // 但为了满足"可以点击"的需求，同时保留悬停，最简单的方式是让点击也显示
                });
                
                container.appendChild(dot);
            });
            
            // 点击空白处关闭 Tooltip
            document.addEventListener('click', () => {
                 tooltip.style.opacity = '0';
            });
        }
        
        function showTooltip(dot, sep) {
            const container = document.getElementById('sephirothDots');
            const tooltip = document.getElementById('dotTooltip');
            
            dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
            dot.style.zIndex = '10';
            
            // Set content first to get dimensions
            tooltip.innerHTML = \`
                <h4>\${sep.name} (\${sep.id})</h4>
                <p>年龄: \${sep.age}岁</p>
                <p>能量值: \${sep.energy.toFixed(1)}/10</p>
                <p>\${sephirothDescriptions[sep.id]}</p>
            \`;
            
            // Ensure visible for calculation
            tooltip.style.opacity = '1';
            
            // Use style coordinates (relative to container) for stable positioning
            // dot.style.left is the center x of the dot
            // dot.style.top is the center y of the dot
            const dotX = parseFloat(dot.style.left);
            const dotY = parseFloat(dot.style.top);
            
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;
            const containerWidth = container.offsetWidth;
            
            // Initial Position: Top-Right relative to dot center
            // 20px right, and above the dot
            let left = dotX + 20;
            let top = dotY - tooltipHeight - 10;
            
            // Boundary Check: Right edge
            if (left + tooltipWidth > containerWidth) {
                // Flip to left side
                left = dotX - tooltipWidth - 20;
            }
            
            // Boundary Check: Top edge
            if (top < 10) {
                // Flip to bottom
                top = dotY + 20;
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            
            // Auto hide delay
            setTimeout(() => {
                dot.style.transform = 'translate(-50%, -50%)';
                dot.style.zIndex = '';
            }, 3000);
        }
        
        // 创建源质信息卡片
        function createSephirahCards() {
            const container = document.getElementById('sephirothInfo');
            container.innerHTML = '';
            
            sephirothData.forEach(sep => {
                const card = document.createElement('div');
                card.className = 'sephiroth-card';
                card.dataset.id = sep.id;
                
                card.innerHTML = \`
                    <div class="number">源质 \${sep.id}</div>
                    <h3>\${sep.name}</h3>
                    <p>\${sephirothDescriptions[sep.id]}</p>
                    <p style="margin-top: 8px; font-size: 12px; color: #777;">
                        关键年龄: \${sep.age}岁 | 能量: \${sep.energy.toFixed(1)}/10
                    </p>
                \`;
                
                // 点击卡片高亮对应的点
                card.addEventListener('mouseenter', () => {
                    const dot = document.querySelector(\`.dot[data-id="\${sep.id}"]\`);
                    if (dot) {
                        dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
                        dot.style.zIndex = '10';
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    const dot = document.querySelector(\`.dot[data-id="\${sep.id}"]\`);
                    if (dot && !dot.matches(':hover')) {
                        dot.style.transform = 'translate(-50%, -50%)';
                        dot.style.zIndex = '';
                    }
                });
                
                container.appendChild(card);
            });
        }
        
        // 初始化视图控制
        document.getElementById('viewKLine').addEventListener('click', () => {
            drawChart('kline');
            document.getElementById('viewKLine').style.background = 'rgba(0, 0, 0, 0.1)';
            document.getElementById('viewEnergyFlow').style.background = 'rgba(0, 0, 0, 0.05)';
        });
        
        document.getElementById('viewEnergyFlow').addEventListener('click', () => {
            drawChart('energy');
            document.getElementById('viewEnergyFlow').style.background = 'rgba(0, 0, 0, 0.1)';
            document.getElementById('viewKLine').style.background = 'rgba(0, 0, 0, 0.05)';
        });
        
        document.getElementById('resetView').addEventListener('click', () => {
            drawChart('kline');
            document.getElementById('viewKLine').style.background = 'rgba(0, 0, 0, 0.05)';
            document.getElementById('viewEnergyFlow').style.background = 'rgba(0, 0, 0, 0.05)';
        });
        
        // 初始化和响应式
        window.addEventListener('load', () => {
            resizeCanvas();
            createSephirahCards();
            document.getElementById('viewKLine').style.background = 'rgba(0, 0, 0, 0.1)';
        });
        
        window.addEventListener('resize', resizeCanvas);
        
        // 添加简单的动画效果
        setTimeout(() => {
            document.querySelectorAll('.sephiroth-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 500);
    </script>
</body>
</html>`;

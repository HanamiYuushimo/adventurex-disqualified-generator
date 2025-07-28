document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const topIconSelect = document.getElementById('topIcon');
    const cardColorSelect = document.getElementById('cardColor');
    const customColorInput = document.getElementById('customColor');
    const mainTextInput = document.getElementById('mainText');
    const englishTextInput = document.getElementById('englishText');
    const secondaryTextInput = document.getElementById('secondaryText');
    const secondaryEnglishTextInput = document.getElementById('secondaryEnglishText');
    const bottomIconInput = document.getElementById('bottomIcon');
    const cardSizeSelect = document.getElementById('cardSize');
    const generateBtn = document.getElementById('generateBtn');
    
    // 预览元素
    const previewCard = document.getElementById('preview');
    const previewTopIcon = previewCard.querySelector('.top-icon .material-icons');
    const previewMainText = previewCard.querySelector('.main-text');
    const previewEnglishText = previewCard.querySelector('.english-text');
    const previewSecondaryText = previewCard.querySelector('.secondary-text');
    const previewSecondaryEnglishText = previewCard.querySelector('.secondary-english-text');
    const previewBottomIcon = document.getElementById('bottomIconPreview');
    
    // 自定义颜色显示/隐藏逻辑
    cardColorSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customColorInput.style.display = 'block';
            const color = customColorInput.value;
            previewCard.querySelector('.card-content').style.backgroundColor = color;
            previewCard.querySelector('.top-icon .material-icons').style.backgroundColor = color;
        } else {
            customColorInput.style.display = 'none';
            const color = this.value;
            previewCard.querySelector('.card-content').style.backgroundColor = color;
            previewCard.querySelector('.top-icon .material-icons').style.backgroundColor = color;
        }
    });
    
    // 自定义颜色变化时更新预览
    customColorInput.addEventListener('input', function() {
        const color = this.value;
        previewCard.querySelector('.card-content').style.backgroundColor = color;
        previewCard.querySelector('.top-icon .material-icons').style.backgroundColor = color;
    });
    
    // 更新顶部图标
    topIconSelect.addEventListener('change', function() {
        previewTopIcon.textContent = this.value;
    });
    
    // 更新文本内容
    mainTextInput.addEventListener('input', function() {
        previewMainText.textContent = this.value;
    });
    
    englishTextInput.addEventListener('input', function() {
        previewEnglishText.textContent = this.value.toUpperCase();
    });
    
    secondaryTextInput.addEventListener('input', function() {
        previewSecondaryText.textContent = this.value;
    });
    
    secondaryEnglishTextInput.addEventListener('input', function() {
        previewSecondaryEnglishText.textContent = this.value.toUpperCase();
    });
    
    // 更新底部图标
    bottomIconInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // 创建一个临时图像来处理图标
                const tempImg = new Image();
                tempImg.onload = function() {
                    // 创建canvas来处理图像
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = tempImg.width;
                    canvas.height = tempImg.height;
                    
                    // 绘制原始图像
                    ctx.drawImage(tempImg, 0, 0);
                    
                    // 获取图像数据
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    // 将非透明像素转为白色
                    for (let i = 0; i < data.length; i += 4) {
                        if (data[i + 3] > 0) { // 如果不是完全透明
                            data[i] = 255;     // R
                            data[i + 1] = 255; // G
                            data[i + 2] = 255; // B
                        }
                    }
                    
                    // 将处理后的图像数据放回canvas
                    ctx.putImageData(imageData, 0, 0);
                    
                    // 更新预览图标
                    previewBottomIcon.src = canvas.toDataURL('image/png');
                };
                tempImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 更新卡片尺寸
    cardSizeSelect.addEventListener('change', function() {
        previewCard.setAttribute('data-size', this.value);
    });
    
    // 生成警示牌图片
    generateBtn.addEventListener('click', function() {
        // 显示加载提示
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = '正在生成图片...';
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.padding = '15px 30px';
        loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        loadingMessage.style.color = 'white';
        loadingMessage.style.borderRadius = '5px';
        loadingMessage.style.zIndex = '9999';
        document.body.appendChild(loadingMessage);
        
        // 根据选择的尺寸设置实际像素大小
        let width, height;
        const size = cardSizeSelect.value;
        
        switch(size) {
            case '9:16':
                width = 1080;
                height = 1920;
                break;
            case '3:4':
                width = 1440;
                height = 1920;
                break;
            case 'A4':
                width = 2100; // 约210mm宽
                height = 2970; // 约297mm高
                break;
            default:
                width = 1080;
                height = 1920;
        }
        
        // 创建一个完全独立的导出元素
        const exportContainer = document.createElement('div');
        exportContainer.style.position = 'fixed';
        exportContainer.style.left = '-9999px';
        exportContainer.style.top = '0';
        exportContainer.style.width = `${width}px`;
        exportContainer.style.height = `${height}px`;
        exportContainer.style.backgroundColor = 'white'; // 改为白色背景
        exportContainer.style.overflow = 'hidden';
        exportContainer.style.visibility = 'hidden'; // 隐藏但允许渲染
        document.body.appendChild(exportContainer);
        
        // 创建警示牌元素
        const cardToExport = document.createElement('div');
        cardToExport.className = 'warning-card';
        cardToExport.style.position = 'relative';
        cardToExport.style.width = '100%';
        cardToExport.style.height = '100%';
        cardToExport.style.margin = '0';
        cardToExport.style.padding = '0';
        cardToExport.style.boxShadow = 'none';
        cardToExport.style.borderRadius = '0';
        cardToExport.style.overflow = 'hidden';
        cardToExport.style.display = 'flex';
        cardToExport.style.flexDirection = 'column';
        cardToExport.style.backgroundColor = 'white'; // 确保警示牌背景为白色
        
        // 创建内容区域
        const contentToExport = document.createElement('div');
        contentToExport.className = 'card-content';
        contentToExport.style.flex = '1';
        contentToExport.style.margin = '0';
        contentToExport.style.padding = '20px';
        contentToExport.style.borderRadius = '0';
        contentToExport.style.display = 'flex';
        contentToExport.style.flexDirection = 'column';
        contentToExport.style.justifyContent = size === '9:16' ? 'flex-start' : 'space-between'; // 16:9尺寸时改为从顶部开始布局
        contentToExport.style.textAlign = 'center';
        contentToExport.style.backgroundColor = cardColorSelect.value === 'custom' ? 
            customColorInput.value : cardColorSelect.value;
        
        // 计算内容区域的缩放比例
        const contentScale = width / 400; // 400px是预览卡片的最大宽度
        
        // 为16:9尺寸调整内容区域的内边距
        if (size === '9:16') {
            contentToExport.style.paddingTop = `${Math.round(40 * contentScale)}px`;
            contentToExport.style.paddingBottom = `${Math.round(40 * contentScale)}px`;
        }
        
        // 创建顶部图标
        const topIconContainer = document.createElement('div');
        topIconContainer.className = 'top-icon';
        topIconContainer.style.display = 'flex';
        topIconContainer.style.justifyContent = 'center';
        topIconContainer.style.alignItems = 'center';
        topIconContainer.style.padding = `${Math.round(30 * contentScale)}px 0`;
        
        const topIconElement = document.createElement('span');
        topIconElement.className = 'material-icons';
        topIconElement.textContent = topIconSelect.value;
        topIconElement.style.fontSize = `${Math.round(60 * contentScale)}px`;
        topIconElement.style.backgroundColor = cardColorSelect.value === 'custom' ? 
            customColorInput.value : cardColorSelect.value;
        topIconElement.style.color = 'white';
        topIconElement.style.borderRadius = '50%';
        topIconElement.style.width = `${Math.round(80 * contentScale)}px`;
        topIconElement.style.height = `${Math.round(80 * contentScale)}px`;
        topIconElement.style.display = 'flex';
        topIconElement.style.justifyContent = 'center';
        topIconElement.style.alignItems = 'center';
        
        topIconContainer.appendChild(topIconElement);
        cardToExport.appendChild(topIconContainer);
        
        // 创建主要文本
        const mainTextElement = document.createElement('div');
        mainTextElement.className = 'main-text';
        mainTextElement.textContent = mainTextInput.value;
        mainTextElement.style.fontSize = `${Math.round(48 * contentScale)}px`;
        mainTextElement.style.fontWeight = 'bold';
        
        // 为16:9尺寸调整文本间距
        if (size === '9:16') {
            mainTextElement.style.marginBottom = `${Math.round(10 * contentScale)}px`;
        } else {
            mainTextElement.style.marginBottom = `${Math.round(15 * contentScale)}px`;
        }
        
        contentToExport.appendChild(mainTextElement);
        
        // 创建英文文本
        const englishTextElement = document.createElement('div');
        englishTextElement.className = 'english-text';
        englishTextElement.textContent = englishTextInput.value.toUpperCase();
        englishTextElement.style.fontSize = `${Math.round(40 * contentScale)}px`;
        englishTextElement.style.fontWeight = 'bold';
        
        if (size === '9:16') {
            englishTextElement.style.marginBottom = `${Math.round(20 * contentScale)}px`;
        } else {
            englishTextElement.style.marginBottom = `${Math.round(30 * contentScale)}px`;
        }
        
        contentToExport.appendChild(englishTextElement);
        
        // 创建次要文本
        const secondaryTextElement = document.createElement('div');
        secondaryTextElement.className = 'secondary-text';
        secondaryTextElement.textContent = secondaryTextInput.value;
        secondaryTextElement.style.fontSize = `${Math.round(36 * contentScale)}px`;
        
        if (size === '9:16') {
            secondaryTextElement.style.marginBottom = `${Math.round(10 * contentScale)}px`;
        } else {
            secondaryTextElement.style.marginBottom = `${Math.round(15 * contentScale)}px`;
        }
        
        contentToExport.appendChild(secondaryTextElement);
        
        // 创建次要英文文本
        const secondaryEnglishTextElement = document.createElement('div');
        secondaryEnglishTextElement.className = 'secondary-english-text';
        secondaryEnglishTextElement.textContent = secondaryEnglishTextInput.value.toUpperCase();
        secondaryEnglishTextElement.style.fontSize = `${Math.round(30 * contentScale)}px`;
        
        if (size === '9:16') {
            secondaryEnglishTextElement.style.marginBottom = `${Math.round(20 * contentScale)}px`;
        } else {
            secondaryEnglishTextElement.style.marginBottom = `${Math.round(40 * contentScale)}px`;
        }
        
        contentToExport.appendChild(secondaryEnglishTextElement);
        
        // 创建底部图标
        if (bottomIconInput.files && bottomIconInput.files[0]) {
            const bottomIconContainer = document.createElement('div');
            bottomIconContainer.className = 'bottom-icon';
            bottomIconContainer.style.display = 'flex';
            bottomIconContainer.style.justifyContent = 'center';
            
            // 调整底部图标的位置，特别是16:9尺寸下
            if (size === '9:16') {
                bottomIconContainer.style.marginTop = `${Math.round(30 * contentScale)}px`;
                bottomIconContainer.style.paddingTop = `0`;
            } else {
                bottomIconContainer.style.marginTop = 'auto';
                bottomIconContainer.style.paddingTop = `${Math.round(20 * contentScale)}px`;
            }
            
            const bottomIconElement = document.createElement('img');
            bottomIconElement.src = previewBottomIcon.src;
            bottomIconElement.style.width = `${Math.round(60 * contentScale)}px`;
            bottomIconElement.style.height = `${Math.round(60 * contentScale)}px`;
            bottomIconElement.style.filter = 'brightness(0) invert(1)';
            
            bottomIconContainer.appendChild(bottomIconElement);
            contentToExport.appendChild(bottomIconContainer);
        }
        
        // 将内容区域添加到导出卡片
        cardToExport.appendChild(contentToExport);
        
        // 将导出卡片添加到容器
        exportContainer.appendChild(cardToExport);
        
        // 给DOM元素一点时间完全渲染
        setTimeout(() => {
            // 使用html2canvas库将div转换为canvas
            html2canvas(cardToExport, {
                scale: 3, // 高分辨率
                useCORS: true,
                backgroundColor: 'white', // 改为白色背景
                width: width,
                height: height,
                logging: true, // 启用日志以便调试
                allowTaint: true,
                imageTimeout: 0, // 禁用图像超时
                onclone: function(clonedDoc) {
                    // 确保克隆的文档中的元素样式正确应用
                    const clonedCard = clonedDoc.querySelector('.warning-card');
                    if (clonedCard) {
                        clonedCard.style.visibility = 'visible';
                    }
                }
            }).then(canvas => {
                // 将canvas转换为图片并下载
                try {
                    const imgData = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = '警示牌.png';
                    link.href = imgData;
                    link.click();
                    console.log('图片生成成功');
                } catch (e) {
                    console.error('转换图片数据时出错:', e);
                    alert('生成图片时出错，请重试。');
                }
                
                // 移除临时元素和加载提示
                document.body.removeChild(exportContainer);
                document.body.removeChild(loadingMessage);
            }).catch(error => {
                console.error('Error generating image:', error);
                alert('生成图片时出错，请重试。');
                document.body.removeChild(exportContainer);
                document.body.removeChild(loadingMessage);
            });
        }, 500); // 给500毫秒让DOM完全渲染
    });
    
    // 初始化预览
    previewCard.setAttribute('data-size', cardSizeSelect.value);
    previewEnglishText.textContent = englishTextInput.value.toUpperCase();
    previewSecondaryEnglishText.textContent = secondaryEnglishTextInput.value.toUpperCase();
});

// 由于我们需要html2canvas库来生成图片，动态加载该库
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 加载html2canvas库
loadScript('https://html2canvas.hertzen.com/dist/html2canvas.min.js').catch(error => {
    console.error('Failed to load html2canvas library:', error);
    alert('无法加载图片生成库，请检查网络连接后重试。');
});
// استخراج بيانات المنتج من DOM
const productName = document.querySelector('.product-title').textContent.trim();
const priceText = document.querySelector('.price').textContent;
const pricePerUnit = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 15000;

// عناصر DOM الرئيسية
const phoneInput = document.getElementById('phoneNumber');
const quantityElement = document.getElementById('quantity');
const totalPriceElement = document.getElementById('totalPrice');
const currentPriceElement = document.getElementById('currentPrice');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const orderForm = document.getElementById('orderForm');
const submitBtn = document.getElementById('submitBtn');

// عناصر النوافذ المنبثقة
const confirmationModal = document.getElementById('confirmationModal');
const confirmationDetails = document.getElementById('confirmationDetails');
const confirmOrderBtn = document.getElementById('confirmOrder');
const cancelOrderBtn = document.getElementById('cancelOrder');
const successModal = document.getElementById('successModal');
const successDetails = document.getElementById('successDetails');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// متغيرات الحالة
let currentQuantity = 1;
let isSubmitting = false;

// --- التحكم في إدخال رقم الهاتف ---
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value;
    // إزالة جميع الأحرف غير الرقمية
    value = value.replace(/\D/g, '');
    // تحديد الحد الأقصى 11 رقم
    value = value.slice(0, 11);
    e.target.value = value;
    
    // تغيير لون الحدود حسب صحة الرقم
    if (value.length === 11 && value.startsWith('07')) {
        e.target.style.borderColor = 'var(--success-color)';
    } else if (value.length > 0) {
        e.target.style.borderColor = 'var(--danger-color)';
    } else {
        e.target.style.borderColor = 'var(--border-color)';
    }
});

// --- التحقق من صحة رقم الهاتف ---
function validatePhoneNumber(phoneNumber) {
    return phoneNumber.length === 11 && phoneNumber.startsWith('07');
}

// --- تحديث السعر عند تغيير الكمية ---
function updatePrice() {
    const totalPrice = currentQuantity * pricePerUnit;
    const formattedPrice = totalPrice.toLocaleString('en-US') + ' د.ع';
    
    totalPriceElement.textContent = formattedPrice;
    currentPriceElement.textContent = formattedPrice;
    
    // تحديث العنوان لإظهار السعر الإجمالي
    document.title = `اطلب الآن - ${productName} - ${formattedPrice}`;
}

// --- تحديث الكمية ---
function updateQuantity(change) {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 99) {
        currentQuantity = newQuantity;
        quantityElement.textContent = currentQuantity;
        updatePrice();
        
        // تحديث حالة الأزرار
        decreaseBtn.disabled = currentQuantity === 1;
        increaseBtn.disabled = currentQuantity === 99;
        
        // إضافة تأثير بصري للتغيير
        quantityElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            quantityElement.style.transform = 'scale(1)';
        }, 150);
    }
}

// أحداث أزرار الكمية
decreaseBtn.addEventListener('click', () => updateQuantity(-1));
increaseBtn.addEventListener('click', () => updateQuantity(1));

// --- التحكم بالكمية بالكيبورد ---
document.addEventListener('keydown', function(e) {
    if (document.activeElement === quantityElement.parentElement) {
        if (e.key === 'ArrowUp' || e.key === '+') {
            e.preventDefault();
            updateQuantity(1);
        } else if (e.key === 'ArrowDown' || e.key === '-') {
            e.preventDefault();
            updateQuantity(-1);
        }
    }
});

// --- عرض نافذة التأكيد ---
function showConfirmationModal(formData) {
    const totalPrice = currentQuantity * pricePerUnit;
    
    confirmationDetails.innerHTML = `
        <div class="confirmation-row">
            <span class="confirmation-label">المنتج:</span>
            <span class="confirmation-value">${productName}</span>
        </div>
        <div class="confirmation-row">
            <span class="confirmation-label">الاسم:</span>
            <span class="confirmation-value">${formData.customerName}</span>
        </div>
        <div class="confirmation-row">
            <span class="confirmation-label">رقم الهاتف:</span>
            <span class="confirmation-value">${formData.phoneNumber}</span>
        </div>
        <div class="confirmation-row">
            <span class="confirmation-label">العنوان:</span>
            <span class="confirmation-value">${formData.address}</span>
        </div>
        <div class="confirmation-row">
            <span class="confirmation-label">الكمية:</span>
            <span class="confirmation-value">${currentQuantity}</span>
        </div>
        <div class="confirmation-row">
            <span class="confirmation-label">السعر لكل وحدة:</span>
            <span class="confirmation-value">${pricePerUnit.toLocaleString('en-US')} د.ع</span>
        </div>
        <div class="confirmation-row" style="border-top: 2px solid var(--primary-color); padding-top: 10px; margin-top: 10px;">
            <span class="confirmation-label">المبلغ الإجمالي:</span>
            <span class="confirmation-value" style="color: var(--primary-color); font-weight: 800;">${totalPrice.toLocaleString('en-US')} د.ع</span>
        </div>
        ${formData.notes ? `
        <div class="confirmation-row">
            <span class="confirmation-label">الملاحظات:</span>
            <span class="confirmation-value">${formData.notes}</span>
        </div>
        ` : ''}
    `;
    
    confirmationModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // التركيز على زر التأكيد
    setTimeout(() => confirmOrderBtn.focus(), 100);
}

// --- إخفاء نافذة التأكيد ---
function hideConfirmationModal() {
    confirmationModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --- عرض نافذة النجاح ---
function showSuccessModal(formData) {
    const totalPrice = currentQuantity * pricePerUnit;
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    
    successDetails.innerHTML = `
        <div class="success-row" style="border: 2px solid var(--success-color); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <span class="success-label">رقم الطلب:</span>
            <span class="success-value" style="color: var(--success-color); font-weight: 800;">#${orderNumber}</span>
        </div>
        <div class="success-row">
            <span class="success-label">المنتج:</span>
            <span class="success-value">${productName}</span>
        </div>
        <div class="success-row">
            <span class="success-label">الاسم:</span>
            <span class="success-value">${formData.customerName}</span>
        </div>
        <div class="success-row">
            <span class="success-label">رقم الهاتف:</span>
            <span class="success-value">${formData.phoneNumber}</span>
        </div>
        <div class="success-row">
            <span class="success-label">العنوان:</span>
            <span class="success-value">${formData.address}</span>
        </div>
        <div class="success-row">
            <span class="success-label">الكمية:</span>
            <span class="success-value">${currentQuantity}</span>
        </div>
        <div class="success-row">
            <span class="success-label">سعر الوحدة:</span>
            <span class="success-value">${pricePerUnit.toLocaleString('en-US')} د.ع</span>
        </div>
        <div class="success-row" style="border-top: 2px solid var(--success-color); padding-top: 10px; margin-top: 10px;">
            <span class="success-label">المبلغ الإجمالي:</span>
            <span class="success-value" style="color: var(--success-color); font-weight: 800;">${totalPrice.toLocaleString('en-US')} د.ع</span>
        </div>
        ${formData.notes ? `
        <div class="success-row">
            <span class="success-label">الملاحظات:</span>
            <span class="success-value">${formData.notes}</span>
        </div>
        ` : ''}
    `;
    
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // التركيز على زر الإغلاق
    setTimeout(() => closeSuccessBtn.focus(), 100);
}

// --- إخفاء نافذة النجاح ---
function hideSuccessModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --- إرسال البيانات عبر Telegram ---
async function sendToTelegram(data) {
    const totalPrice = data.quantity * pricePerUnit;
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    
    const message = `
🛒 *طلب جديد - ${productName}*
*═════════════════════*
🏷️ *رقم الطلب:* #${orderNumber}
*═════════════════════*
👤 *الاسم:* ${data.customerName}
📱 *رقم الهاتف:* ${data.phoneNumber}
📍 *العنوان:* ${data.address}
*═════════════════════*
📦 *الكمية:* ${data.quantity}
💵 *سعر الوحدة:* ${pricePerUnit.toLocaleString('en-US')} د.ع
💰 *المبلغ الإجمالي:* ${totalPrice.toLocaleString('en-US')} د.ع
*═════════════════════*
⏰ *وقت الطلب:* ${new Date().toLocaleString('en-us')}
${data.notes ? `📝 *الملاحظات:* ${data.notes}` : ''}
`;

    const botToken = '8113227302:AAF-RvRdBkwrneirR7BWwVImwbPMwOXhh4w';
    const chatIds = ['6038843849', '1734895857'];
    
    const promises = chatIds.map(chatId => 
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        }).catch(error => {
            console.log('Telegram send error for chat', chatId, ':', error);
            return null;
        })
    );
    
    try {
        await Promise.all(promises);
        return true;
    } catch (error) {
        console.log('Failed to send to all chats:', error);
        return false;
    }
}
// --- التحقق من صحة النموذج ---
function validateForm(formData) {
    const errors = [];
    
    if (!formData.customerName.trim()) {
        errors.push('يرجى إدخال الاسم');
    }
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
        errors.push('يرجى إدخال رقم هاتف صحيح (11 رقم يبدأ بـ 07)');
    }
    
    if (!formData.address.trim()) {
        errors.push('يرجى إدخال العنوان');
    }
    
    if (currentQuantity < 1 || currentQuantity > 99) {
        errors.push('الكمية يجب أن تكون بين 1 و 99');
    }
    
    return errors;
}

// --- عرض رسائل الخطأ ---
function showErrors(errors) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-messages';
    errorContainer.style.cssText = `
        background: var(--danger-color);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
    `;
    
    errorContainer.innerHTML = errors.map(error => `• ${error}`).join('<br>');
    
    // إزالة رسائل الخطأ السابقة
    const existingErrors = document.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    // إضافة رسائل الخطأ الجديدة
    orderForm.insertBefore(errorContainer, orderForm.firstChild);
    
    // إزالة رسائل الخطأ بعد 5 ثوان
    setTimeout(() => {
        if (errorContainer && errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 5000);
}

// --- معالجة إرسال النموذج ---
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const formData = {
        customerName: document.getElementById('customerName').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        address: document.getElementById('address').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        quantity: currentQuantity
    };
    
    // التحقق من صحة البيانات
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // إزالة رسائل الخطأ إن وجدت
    const existingErrors = document.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    showConfirmationModal(formData);
});

// --- تأكيد الطلب ---
confirmOrderBtn.addEventListener('click', async function() {
    if (isSubmitting) return;
    
    isSubmitting = true;
    hideConfirmationModal();
    
    const formData = {
        customerName: document.getElementById('customerName').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        address: document.getElementById('address').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        quantity: currentQuantity
    };
    
    // تعطيل الزر وإظهار حالة التحميل
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.style.cursor = 'not-allowed';
    
    try {
        // محاكاة وقت الإرسال
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // إرسال البيانات
        const success = await sendToTelegram(formData);
        
        if (success) {
            showSuccessModal(formData);
            resetForm();
        } else {
            throw new Error('فشل في الإرسال');
        }
        
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
        // إعادة تفعيل الزر
        submitBtn.disabled = false;
        submitBtn.textContent = 'إرسال الطلب';
        submitBtn.style.cursor = 'pointer';
        isSubmitting = false;
    }
});

// --- إعادة تعيين النموذج ---
function resetForm() {
    orderForm.reset();
    currentQuantity = 1;
    quantityElement.textContent = currentQuantity;
    updatePrice();
    decreaseBtn.disabled = true;
    increaseBtn.disabled = false;
    
    // إعادة تعيين ألوان الحدود
    phoneInput.style.borderColor = 'var(--border-color)';
}

// --- إلغاء الطلب ---
cancelOrderBtn.addEventListener('click', function() {
    hideConfirmationModal();
});

// --- إغلاق نافذة النجاح ---
closeSuccessBtn.addEventListener('click', function() {
    hideSuccessModal();
});

// --- إغلاق النوافذ المنبثقة بالنقر خارجها ---
confirmationModal.addEventListener('click', function(e) {
    if (e.target === confirmationModal) {
        hideConfirmationModal();
    }
});

successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        hideSuccessModal();
    }
});

// --- التحكم بالنوافذ المنبثقة بالكيبورد ---
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (confirmationModal.style.display === 'flex') {
            hideConfirmationModal();
        }
        if (successModal.style.display === 'flex') {
            hideSuccessModal();
        }
    }
});

// --- تحسين الأداء: تأخير تحديث السعر ---
let priceUpdateTimeout;
function debouncedUpdatePrice() {
    clearTimeout(priceUpdateTimeout);
    priceUpdateTimeout = setTimeout(updatePrice, 100);
}

// --- تهيئة الصفحة ---
document.addEventListener('DOMContentLoaded', function() {
    // تحديث السعر الأولي
    updatePrice();
    
    // التركيز على أول حقل
    const firstInput = document.getElementById('customerName');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 500);
    }
    
    // إضافة مستمع لتغيير حجم النافذة لتحديث التخطيط
    window.addEventListener('resize', function() {
        // إعادة حساب الارتفاعات إذا لزم الأمر
        debouncedUpdatePrice();
    });
    
    console.log('صفحة الطلب جاهزة للاستخدام');
});

// --- منع إرسال النموذج عدة مرات ---
window.addEventListener('beforeunload', function() {
    if (isSubmitting) {
        return 'يتم إرسال طلبك حالياً. هل أنت متأكد من أنك تريد مغادرة الصفحة؟';
    }
});

// تحديث السعر عند تحميل الصفحة
updatePrice();

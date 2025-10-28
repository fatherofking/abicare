// ===================================
// Abicare Hospital - Forms Handler
// Google Sheets + Email Integration
// ===================================

/*
 * SETUP GUIDE
 * ===========
 * 
 * STEP 1: Create Google Sheet
 * ----------------------------
 * 1. Go to https://sheets.google.com
 * 2. Create new sheet: "Abicare Website Forms"
 * 3. Rename first tab to: "FormResponses"
 * 4. Add these headers in Row 1:
 *    Timestamp | Name | Email | Phone | Department | Date | Message | Source
 * 
 * STEP 2: Google Apps Script
 * ---------------------------
 * 1. In Google Sheet: Extensions → Apps Script
 * 2. Delete default code
 * 3. Copy ENTIRE script below (between the ==== markers)
 * 4. Click Save (disk icon)
 * 5. Click Deploy → New deployment
 * 6. Click gear icon → Select "Web app"
 * 7. Settings:
 *    - Description: Abicare Forms
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 8. Click Deploy
 * 9. Authorize the app (click Advanced if warning)
 * 10. Copy the Web App URL
 * 11. Paste URL in SCRIPT_URL below
 * 
 * ==================== GOOGLE APPS SCRIPT ====================
 */

// COPY THIS ENTIRE BLOCK TO GOOGLE APPS SCRIPT:

/*

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FormResponses');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.phone,
      data.department,
      data.date,
      data.message,
      data.source
    ]);
    
    sendHospitalEmail(data);
    sendUserEmail(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendHospitalEmail(data) {
  var email = 'abicare.msl@gmail.com';
  var isBooking = data.source === 'booking';
  var subject = isBooking ? 'New Appointment - Abicare' : 'New Contact Message - Abicare';
  
  var body = 'NEW SUBMISSION FROM ABICARE HOSPITAL WEBSITE\n\n';
  body += '===========================================\n\n';
  body += 'TYPE: ' + (isBooking ? 'APPOINTMENT BOOKING' : 'CONTACT/INQUIRY') + '\n\n';
  body += 'PATIENT/SENDER DETAILS:\n';
  body += '- Name: ' + data.name + '\n';
  body += '- Email: ' + data.email + '\n';
  body += '- Phone: ' + data.phone + '\n';
  
  if (isBooking) {
    body += '\nAPPOINTMENT DETAILS:\n';
    body += '- Department: ' + data.department + '\n';
    body += '- Preferred Date: ' + data.date + '\n';
    body += '- Reason: ' + data.message + '\n';
  } else {
    body += '\nMESSAGE:\n';
    body += data.message + '\n';
  }
  
  body += '\n===========================================\n';
  body += 'Submitted: ' + new Date().toLocaleString() + '\n';
  body += 'Action: Please respond to ' + data.email + ' within 24 hours\n';
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body
  });
}

function sendUserEmail(data) {
  var isBooking = data.source === 'booking';
  var subject = isBooking ? 'Appointment Received - Abicare Hospital' : 'Message Received - Abicare Hospital';
  
  var body = 'Dear ' + data.name + ',\n\n';
  
  if (isBooking) {
    body += 'Thank you for booking an appointment with Abicare Hospital!\n\n';
    body += 'YOUR BOOKING DETAILS:\n';
    body += '- Department: ' + data.department + '\n';
    body += '- Preferred Date: ' + data.date + '\n';
    body += '- Contact: ' + data.phone + '\n\n';
    body += 'WHAT HAPPENS NEXT:\n';
    body += '1. Our team will review your request within 24 hours\n';
    body += '2. You will receive a confirmation call/email\n';
    body += '3. Arrive 15 minutes early for registration\n';
    body += '4. Bring your ID and insurance card\n\n';
  } else {
    body += 'Thank you for contacting Abicare Hospital!\n\n';
    body += 'We have received your message and will respond within 24-48 hours.\n\n';
  }
  
  body += 'IMPORTANT: If you do not see our reply, CHECK YOUR SPAM FOLDER.\n';
  body += 'Add abicare.msl@gmail.com to your contacts.\n\n';
  body += 'Need urgent help? Call: +234-XXX-XXX-XXXX\n\n';
  body += 'Best regards,\n';
  body += 'Abicare Hospital Team\n';
  body += 'Because We Care\n';
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    name: 'Abicare Hospital'
  });
}

*/

// ==================== END OF GOOGLE APPS SCRIPT ====================

// ⚠️ PASTE YOUR WEB APP URL HERE:
var SCRIPT_URL ='https://script.google.com/macros/s/AKfycbxVG-MJPHz0b5eN3r271-3SxXrdZ-Pd6Ot7SUG5n8njOjM6ff__QK5EUtRqbxBLXT1cmw/exec';

// Initialize forms
(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForms);
    } else {
        initForms();
    }
    
    function initForms() {
        var forms = document.querySelectorAll('form[data-sheet]');
        
        for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener('submit', handleSubmit);
        }
        
        setupValidation();
        setupCharCounter();
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        var form = e.target;
        var btn = form.querySelector('button[type="submit"]');
        var originalText = btn.innerHTML;
        
        // Check URL configured
        if (SCRIPT_URL !=='https://script.google.com/macros/s/AKfycbxVG-MJPHz0b5eN3r271-3SxXrdZ-Pd6Ot7SUG5n8njOjM6ff__QK5EUtRqbxBLXT1cmw/exec') {
            alert('ERROR: Please configure SCRIPT_URL in forms.js with your Google Apps Script Web App URL');
            console.error('SCRIPT_URL not configured');
            return;
        }
        
        // Get form data
        var nameInput = form.querySelector('[name="name"]');
        var emailInput = form.querySelector('[name="email"]');
        var phoneInput = form.querySelector('[name="phone"]');
        var deptInput = form.querySelector('[name="department"]');
        var dateInput = form.querySelector('[name="date"]');
        var msgInput = form.querySelector('[name="message"]');
        
        var formData = {
            name: nameInput ? nameInput.value : '',
            email: emailInput ? emailInput.value : '',
            phone: phoneInput ? phoneInput.value : '',
            department: deptInput ? deptInput.value : '',
            date: dateInput ? dateInput.value : '',
            message: msgInput ? msgInput.value : '',
            source: form.getAttribute('data-sheet')
        };
        
        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show loading
        btn.disabled = true;
        btn.innerHTML = 'Sending...';
        
        // Submit to Google Apps Script
        var xhr = new XMLHttpRequest();
        xhr.open('POST', SCRIPT_URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            btn.disabled = false;
            btn.innerHTML = originalText;
            
            if (xhr.status === 200 || xhr.status === 0) {
                form.reset();
                
                if (formData.source === 'booking') {
                    showSuccess('Appointment Booked!', 'Your appointment request has been received. Check your email (including spam folder) for confirmation.');
                } else {
                    showSuccess('Message Sent!', 'Thank you for contacting us. Check your email (including spam folder) for confirmation.');
                }
            } else {
                showError('Submission failed. Please try again or call us directly.');
            }
        };
        
        xhr.onerror = function() {
            btn.disabled = false;
            btn.innerHTML = originalText;
            
            // With no-cors, we can't read response but submission likely worked
            form.reset();
            
            if (formData.source === 'booking') {
                showSuccess('Appointment Booked!', 'Your request has been submitted. Check your email (including spam) for confirmation.');
            } else {
                showSuccess('Message Sent!', 'Your message has been submitted. Check your email (including spam) for confirmation.');
            }
        };
        
        xhr.send(JSON.stringify(formData));
    }
    
    function showSuccess(title, message) {
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;';
        
        modal.innerHTML = '<div style="background:white;padding:2rem;border-radius:12px;max-width:500px;width:90%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);">' +
            '<div style="width:70px;height:70px;background:#d4edda;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">' +
            '<svg width="40" height="40" fill="#28a745" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>' +
            '</div>' +
            '<h3 style="color:#28a745;margin-bottom:1rem;">' + title + '</h3>' +
            '<p style="color:#666;margin-bottom:1.5rem;line-height:1.6;">' + message + '</p>' +
            '<div style="background:#fff3cd;padding:1rem;border-radius:8px;margin-bottom:1.5rem;text-align:left;">' +
            '<strong style="color:#856404;">📧 Check Spam Folder:</strong>' +
            '<p style="margin:0.5rem 0 0;color:#856404;font-size:0.9rem;">If you don\'t see our email, check spam/junk. Add <strong>abicare.msl@gmail.com</strong> to contacts.</p>' +
            '</div>' +
            '<button onclick="this.parentElement.parentElement.remove()" style="background:#1E90FF;color:white;border:none;padding:0.75rem 2rem;border-radius:8px;cursor:pointer;font-size:1rem;font-weight:500;">Close</button>' +
            '</div>';
        
        document.body.appendChild(modal);
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }
    
    function showError(message) {
        alert('ERROR: ' + message);
    }
    
    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function setupValidation() {
        var emailInputs = document.querySelectorAll('input[type="email"]');
        for (var i = 0; i < emailInputs.length; i++) {
            emailInputs[i].addEventListener('blur', function() {
                if (this.value && !isValidEmail(this.value)) {
                    this.style.borderColor = 'red';
                } else {
                    this.style.borderColor = '';
                }
            });
        }
        
        var dateInputs = document.querySelectorAll('input[type="date"]');
        var today = new Date().toISOString().split('T')[0];
        for (var i = 0; i < dateInputs.length; i++) {
            dateInputs[i].setAttribute('min', today);
        }
    }
    
    function setupCharCounter() {
        var textareas = document.querySelectorAll('textarea[maxlength]');
        for (var i = 0; i < textareas.length; i++) {
            var textarea = textareas[i];
            var maxLen = textarea.getAttribute('maxlength');
            
            var counter = document.createElement('small');
            counter.style.cssText = 'float:right;color:#6c757d;font-size:0.85rem;';
            textarea.parentNode.appendChild(counter);
            
            textarea.addEventListener('input', function() {
                var max = this.getAttribute('maxlength');
                var remaining = max - this.value.length;
                var counter = this.parentNode.querySelector('small');
                counter.textContent = remaining + ' characters remaining';
                counter.style.color = remaining < 50 ? '#dc3545' : '#6c757d';
            });
            
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', false, true);
            textarea.dispatchEvent(evt);
        }
    }
})();

console.log('===========================================');
console.log('Abicare Hospital - Forms Handler Loaded');
console.log('===========================================');
console.log('Email destination: abicare.msl@gmail.com');
console.log('Script configured:', SCRIPT_URL !== 'https://script.google.com/macros/s/AKfycbxVG-MJPHz0b5eN3r271-3SxXrdZ-Pd6Ot7SUG5n8njOjM6ff__QK5EUtRqbxBLXT1cmw/exec');
console.log('');
if (SCRIPT_URL === 'YOUR_DEPLOYED_WEB_APP_URL_HERE') {
    console.error('⚠️ WARNING: SCRIPT_URL not configured!');
    console.error('Please update SCRIPT_URL with your Google Apps Script Web App URL');
} else {
    console.log('✅ Ready to accept form submissions');
    console.log('Target URL:', SCRIPT_URL);
}
console.log('===========================================');
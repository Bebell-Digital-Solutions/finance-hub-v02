
    <!-- JavaScript -->
       <script>
        // Enhanced Data Storage with Calendar Integration
        class FinancialData {
            constructor() {
                this.accounts = this.loadFromStorage('accounts', []);
                this.transactions = this.loadFromStorage('transactions', []);
                this.categories = this.loadFromStorage('categories', this.getDefaultCategories());
                this.goals = this.loadFromStorage('goals', []);
                this.settings = this.loadFromStorage('settings', this.getDefaultSettings());
                this.bills = this.loadFromStorage('bills', []);
            }

            loadFromStorage(key, defaultValue) {
                try {
                    const data = localStorage.getItem(`financialData_${key}`);
                    return data ? JSON.parse(data) : defaultValue;
                } catch (error) {
                    console.error(`Error loading ${key} from storage:`, error);
                    return defaultValue;
                }
            }

            saveToStorage(key, data) {
                try {
                    localStorage.setItem(`financialData_${key}`, JSON.stringify(data));
                } catch (error) {
                    console.error(`Error saving ${key} to storage:`, error);
                }
            }

            getDefaultCategories() {
                return [
                    { id: 1, name: "Housing", budget: 1500, color: "#3b82f6" },
                    { id: 2, name: "Food", budget: 600, color: "#10b981" },
                    { id: 3, name: "Transportation", budget: 300, color: "#f59e0b" },
                    { id: 4, name: "Utilities", budget: 200, color: "#8b5cf6" },
                    { id: 5, name: "Entertainment", budget: 150, color: "#ef4444" },
                    { id: 6, name: "Healthcare", budget: 300, color: "#06b6d4" },
                    { id: 7, name: "Shopping", budget: 250, color: "#84cc16" },
                    { id: 8, name: "Salary", budget: 0, color: "#059669" },
                    { id: 9, name: "Freelance", budget: 0, color: "#0ea5e9" },
                    { id: 10, name: "Other", budget: 100, color: "#6b7280" }
                ];
            }

            getDefaultSettings() {
                return {
                    theme: 'system',
                    currency: 'USD',
                    dateFormat: 'MM/DD/YYYY',
                    budgetAlerts: true,
                    billReminders: true,
                    goalProgress: true,
                    emailNotifications: false,
                    notificationEmail: '',
                    notificationFrequency: 'daily',
                    twoFactor: false
                };
            }

            // Account operations
            addAccount(account) {
                account.id = Date.now();
                this.accounts.push(account);
                this.saveToStorage('accounts', this.accounts);
                return account;
            }

            updateAccount(id, updates) {
                const index = this.accounts.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.accounts[index] = { ...this.accounts[index], ...updates };
                    this.saveToStorage('accounts', this.accounts);
                    return this.accounts[index];
                }
                return null;
            }

            deleteAccount(id) {
                this.accounts = this.accounts.filter(a => a.id !== id);
                this.saveToStorage('accounts', this.accounts);
            }

            // Transaction operations
            addTransaction(transaction) {
                transaction.id = Date.now();
                this.transactions.push(transaction);
                
                // Update account balance
                const account = this.accounts.find(a => a.id === transaction.account);
                if (account) {
                    if (transaction.type === 'expense') {
                        account.balance -= Math.abs(transaction.amount);
                    } else if (transaction.type === 'income') {
                        account.balance += Math.abs(transaction.amount);
                    }
                    this.saveToStorage('accounts', this.accounts);
                }
                
                this.saveToStorage('transactions', this.transactions);
                return transaction;
            }

            updateTransaction(id, updates) {
                const index = this.transactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.transactions[index] = { ...this.transactions[index], ...updates };
                    this.saveToStorage('transactions', this.transactions);
                    return this.transactions[index];
                }
                return null;
            }

            deleteTransaction(id) {
                const transaction = this.transactions.find(t => t.id === id);
                if (transaction) {
                
                
                
                    // Reverse account balance change
                    const account = this.accounts.find(a => a.id === transaction.account);
                    if (account) {
                        if (transaction.type === 'expense') {
                            account.balance += Math.abs(transaction.amount);
                        } else if (transaction.type === 'income') {
                            account.balance -= Math.abs(transaction.amount);
                        }
                        this.saveToStorage('accounts', this.accounts);
                    }
                }
                
                this.transactions = this.transactions.filter(t => t.id !== id);
                this.saveToStorage('transactions', this.transactions);
            }

            // Category operations
            addCategory(category) {
                category.id = Date.now();
                this.categories.push(category);
                this.saveToStorage('categories', this.categories);
                return category;
            }

            // Goal operations
            addGoal(goal) {
                goal.id = Date.now();
                this.goals.push(goal);
                this.saveToStorage('goals', this.goals);
                return goal;
            }

            updateGoal(id, updates) {
                const index = this.goals.findIndex(g => g.id === id);
                if (index !== -1) {
                    this.goals[index] = { ...this.goals[index], ...updates };
                    this.saveToStorage('goals', this.goals);
                    return this.goals[index];
                }
                return null;
            }

            deleteGoal(id) {
                this.goals = this.goals.filter(g => g.id !== id);
                this.saveToStorage('goals', this.goals);
            }

            // Settings operations
            updateSettings(updates) {
                this.settings = { ...this.settings, ...updates };
                this.saveToStorage('settings', this.settings);
            }

            // Bills operations
            addBill(bill) {
                bill.id = Date.now();
                this.bills.push(bill);
                this.saveToStorage('bills', this.bills);
                return bill;
            }

            // Clear all data
            clearAllData() {
                this.accounts = [];
                this.transactions = [];
                this.categories = this.getDefaultCategories();
                this.goals = [];
                this.bills = [];
                this.settings = this.getDefaultSettings();
                
                localStorage.removeItem('financialData_accounts');
                localStorage.removeItem('financialData_transactions');
                localStorage.removeItem('financialData_categories');
                localStorage.removeItem('financialData_goals');
                localStorage.removeItem('financialData_bills');
                localStorage.removeItem('financialData_settings');
            }

            // Get transactions for specific date
            getTransactionsForDate(date) {
                const dateStr = date.toISOString().split('T')[0];
                return this.transactions.filter(t => t.date === dateStr);
            }

            // Get bills for specific date
            getBillsForDate(date) {
                const dateStr = date.toISOString().split('T')[0];
                return this.bills.filter(b => b.dueDate === dateStr);
            }
        }

        // Global variables
        let financialData = new FinancialData();
        let currentSection = 'overview';
        let isDarkMode = localStorage.getItem('theme') === 'dark' || 
                        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        let charts = {};
        let emailJS = null;

        // Initialize the application
        function init() {
            // Set initial theme
            applyTheme();
            
            // Set today's date for forms
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('transaction-date').value = today;
            
            // Load initial data
            loadAllData();
            populateDropdowns();
            
            // Initialize icons
            lucide.createIcons();

            // Initialize charts
            setTimeout(() => {
                initCharts();
            }, 100);

            // Set up form handlers
            setupFormHandlers();

            // Load settings
            loadSettings();

            // Initialize EmailJS
            initializeEmailJS();

            // Setup email notification toggle
            setupEmailNotificationToggle();
        }

        // 1. DOMINICAN PESOS (DOP) IMPLEMENTATION
        function formatCurrency(amount) {
            const currency = financialData.settings.currency || 'USD';
            let symbol, locale;
            
            switch(currency) {
                case 'USD':
                    symbol = '$';
                    locale = 'en-US';
                    break;
                case 'EUR':
                    symbol = '€';
                    locale = 'de-DE';
                    break;
                case 'GBP':
                    symbol = '£';
                    locale = 'en-GB';
                    break;
                case 'JPY':
                    symbol = '¥';
                    locale = 'ja-JP';
                    break;
                case 'DOP':
                    symbol = 'RD$';
                    locale = 'es-DO';
                    break;
                default:
                    symbol = '$';
                    locale = 'en-US';
            }
            
            try {
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: currency === 'JPY' ? 0 : 2
                }).format(amount);
            } catch (error) {
                
                
                
                // Fallback for unsupported currencies
                return `${symbol}${amount.toLocaleString('en-US', {
                    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
                    maximumFractionDigits: currency === 'JPY' ? 0 : 2
                })}`;
            }
        }

        
        
        
        
        
        // 2. CALENDAR SYNC IMPLEMENTATION
        function exportCalendar(type) {
            if (type === 'google') {
                exportToGoogleCalendar();
            } else if (type === 'ical') {
                exportToICalendar();
            }
        }

        function exportToGoogleCalendar() {
            const events = getAllCalendarEvents();
            if (events.length === 0) {
                showToast('No events to export', 'info');
                return;
            }

            
            
            
            // Create Google Calendar URLs for each event
            events.forEach(event => {
                const startDate = event.date.replace(/-/g, '');
                const endDate = startDate; // All day events
                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${startDate}&details=${encodeURIComponent(event.description)}`;
                window.open(url, '_blank');
            });
            
            showToast('Opening Google Calendar for each event...', 'success');
        }

        function exportToICalendar() {
            const events = getAllCalendarEvents();
            if (events.length === 0) {
                showToast('No events to export', 'info');
                return;
            }

            let icalContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Financial Dashboard//Financial Events//EN',
                'CALSCALE:GREGORIAN'
            ];

            events.forEach(event => {
                const startDate = event.date.replace(/-/g, '') + 'T120000Z';
                const endDate = event.date.replace(/-/g, '') + 'T130000Z';
                
                icalContent.push(
                    'BEGIN:VEVENT',
                    `UID:${event.id}@financialdashboard.com`,
                    `DTSTART:${startDate}`,
                    `DTEND:${endDate}`,
                    `SUMMARY:${event.title}`,
                    `DESCRIPTION:${event.description}`,
                    `CATEGORIES:${event.category}`,
                    'END:VEVENT'
                );
            });

            icalContent.push('END:VCALENDAR');

            const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'financial-events.ics';
            a.click();
            window.URL.revokeObjectURL(url);
            
            showToast('Calendar exported successfully!', 'success');
        }

        function getAllCalendarEvents() {
            const events = [];
            
           
           
           
           
           // Add transaction events
            financialData.transactions.forEach(transaction => {
                const account = financialData.accounts.find(a => a.id === transaction.account);
                events.push({
                    id: `transaction-${transaction.id}`,
                    title: `${transaction.type === 'expense' ? '📤' : '📥'} ${transaction.description}`,
                    date: transaction.date,
                    description: `${transaction.type.toUpperCase()}: ${formatCurrency(Math.abs(transaction.amount))} - ${transaction.category} (${account?.name || 'Unknown Account'})`,
                    category: 'Transaction'
                });
            });

            // Add bill reminders
            financialData.bills.forEach(bill => {
                events.push({
                    id: `bill-${bill.id}`,
                    title: `💰 Bill Due: ${bill.name}`,
                    date: bill.dueDate,
                    description: `Bill payment due: ${formatCurrency(bill.amount)}`,
                    category: 'Bill'
                });
            });

            // Add goal milestones
            financialData.goals.forEach(goal => {
                if (goal.deadline) {
                    events.push({
                        id: `goal-${goal.id}`,
                        title: `🎯 Goal Deadline: ${goal.name}`,
                        date: goal.deadline,
                        description: `Financial goal target: ${formatCurrency(goal.target)} (Current: ${formatCurrency(goal.current)})`,
                        category: 'Goal'
                    });
                }
            });

            return events;
        }
        
        
        
        

        // 3. TRANSACTIONS IN CALENDAR IMPLEMENTATION
        function loadCalendar() {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            
            const monthYearElement = document.getElementById('calendar-month-year');
            if (monthYearElement) {
                monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            }

            const calendarGrid = document.getElementById('calendar-grid');
            if (!calendarGrid) return;

            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            let calendarHTML = '';
            
            
            
            
            // Empty cells for days before the first day of the month
            for (let i = 0; i < firstDay; i++) {
                calendarHTML += '<div class="p-2 h-20"></div>';
            }
            
            // Days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(currentYear, currentMonth, day);
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === currentMonth && 
                               new Date().getFullYear() === currentYear;
                
                
                
                
                
                // Get events for this date
                const dayTransactions = financialData.getTransactionsForDate(currentDate);
                const dayBills = financialData.getBillsForDate(currentDate);
                
                let eventsHTML = '';
                
                // Add transaction events
                dayTransactions.forEach(transaction => {
                    const eventClass = transaction.type === 'income' ? 'event-income' : 'event-expense';
                    eventsHTML += `<div class="calendar-event ${eventClass}" title="${transaction.description} - ${formatCurrency(Math.abs(transaction.amount))}">${transaction.description.substring(0, 8)}...</div>`;
                });
                
                
                
                
                // Add bill events
                dayBills.forEach(bill => {
                    eventsHTML += `<div class="calendar-event event-bill" title="Bill: ${bill.name} - ${formatCurrency(bill.amount)}">💰 ${bill.name}</div>`;
                });
                
                calendarHTML += `
                    <div class="p-2 h-20 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onclick="showDayDetails('${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}')">
                        <div class="text-sm font-medium text-gray-900 dark:text-white ${isToday ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}">${day}</div>
                        <div class="mt-1 space-y-1 overflow-hidden">
                            ${eventsHTML}
                        </div>
                    </div>
                `;
            }
            
            calendarGrid.innerHTML = calendarHTML;
            loadUpcomingEvents();
        }

        function showDayDetails(date) {
            const selectedDate = new Date(date);
            const transactions = financialData.getTransactionsForDate(selectedDate);
            const bills = financialData.getBillsForDate(selectedDate);
            
            if (transactions.length === 0 && bills.length === 0) {
                showToast('No events on this date', 'info');
                return;
            }
            
            let details = `Events for ${formatDate(date)}:\n\n`;
            
            transactions.forEach(t => {
                const account = financialData.accounts.find(a => a.id === t.account);
                details += `${t.type === 'income' ? '📥' : '📤'} ${t.description}\n`;
                details += `   Amount: ${formatCurrency(Math.abs(t.amount))}\n`;
                details += `   Category: ${t.category}\n`;
                details += `   Account: ${account?.name || 'Unknown'}\n\n`;
            });
            
            bills.forEach(b => {
                details += `💰 ${b.name}\n`;
                details += `   Amount: ${formatCurrency(b.amount)}\n`;
                details += `   Type: Bill Payment\n\n`;
            });
            
            alert(details);
        }

       // 4. NOTION TEMPLATE POPUP IMPLEMENTATION
        function openNotionTemplateModal() {
            showModal('notion-template-modal');
        }

        function copyTemplateText() {
            const templateText = `
# Enhanced Personal Finance Template with DOP Support

## 🚀 Quick Setup Guide:
1. Copy this template into a new Notion page
2. Create the databases following the table structures below
3. Configure currency to Dominican Peso (DOP) format: RD$ #,##0.00
4. Set up the formulas as specified
5. Delete existing sample data from each database
6. Add your accounts with initial balances
7. Set up your expense categories and monthly budgets
8. Start tracking your transactions with recurring options

## 💰 Currency Configuration (Dominican Peso - DOP):
- Currency Symbol: RD$ (Dominican Peso)
- Format: RD$ #,##0.00
- All financial properties configured for DOP

## 📊 Database Structures:

### 📱 Accounts Database
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Account name |
| Type | Select | Checking, Savings, Credit, Investment, Cash |
| Balance | Number (DOP) | Current balance in RD$ |
| Institution | Text | Bank or financial institution |
| Notes | Text | Additional notes |

### 💳 Transactions Database
| Property | Type | Description |
|----------|------|-------------|
| Description | Title | Transaction description |
| Amount | Number (DOP) | Amount in RD$ |
| Type | Select | Income, Expense, Transfer |
| Category | Relation | Link to Categories database |
| Account | Relation | Link to Accounts database |
| Date | Date | Transaction date |
| Recurring | Checkbox | Is this a recurring transaction? |
| Frequency | Select | Daily, Weekly, Monthly, Yearly |
| Next Due | Formula | dateAdd(prop("Date"), 1, prop("Frequency")) |

### 📂 Categories Database
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Category name |
| Type | Select | Income, Expense |
| Budget | Number (DOP) | Monthly budget in RD$ |
| Color | Select | Visual identifier |
| Current Spent | Rollup | Sum of related transactions |
| Budget Remaining | Formula | if(prop("Budget") > 0, prop("Budget") - prop("Current Spent"), 0) |
| Budget Progress | Formula | if(prop("Budget") > 0, round(prop("Current Spent") / prop("Budget") * 100), 0) |

### 🎯 Goals Database
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Goal name |
| Target Amount | Number (DOP) | Target amount in RD$ |
| Current Amount | Number (DOP) | Current saved amount in RD$ |
| Target Date | Date | Target completion date |
| Progress | Formula | round(prop("Current Amount") / prop("Target Amount") * 100) |
| Days Remaining | Formula | dateBetween(prop("Target Date"), now(), "days") |
| Monthly Required | Formula | if(prop("Target Date") > now(), (prop("Target Amount") - prop("Current Amount")) / dateBetween(prop("Target Date"), now(), "months"), 0) |

## 🔄 Recurring Transaction Formulas:

### Next Due Date:
\`\`\`
dateAdd(prop("Last Payment Date"), 1, prop("Frequency"))
\`\`\`

### Budget Remaining:
\`\`\`
if(prop("Monthly Budget") > 0, prop("Monthly Budget") - prop("Current Spent"), 0)
\`\`\`

### Budget Progress Percentage:
\`\`\`
if(prop("Monthly Budget") > 0, round(prop("Current Spent") / prop("Monthly Budget") * 100), 0)
\`\`\`

### Days Until Target:
\`\`\`
dateBetween(prop("Target Date"), now(), "days")
\`\`\`

### Monthly Savings Required:
\`\`\`
if(prop("Target Date") > now(), (prop("Target Amount") - prop("Current Amount")) / dateBetween(prop("Target Date"), now(), "months"), 0)
\`\`\`

## 🎨 Features Included:
- ✅ Complete database setup for accounts, transactions, and categories
- ✅ Dominican Peso (DOP) currency formatting throughout
- ✅ Budget tracking with visual progress indicators  
- ✅ Monthly and yearly financial reports
- ✅ Goal tracking and milestone management
- ✅ Expense categorization system
- ✅ Recurring transaction automation
- ✅ Income and expense analysis templates
- ✅ Enhanced visual hierarchy with emoji indicators
- ✅ Color coding support for quick identification
- ✅ Structured formula organization

## 💡 Pro Tips:
- 📌 Select the correct category for each expense to track budget accurately
- 📌 Update your account balances regularly for accurate reporting  
- 📌 Use the transfer function to move money between accounts
- 📌 Set realistic monthly budgets based on your spending history
- 📌 Set up recurring transactions for regular bills and income
- 📌 Use color coding to quickly identify different types of transactions
- 📌 Review your goals monthly and adjust targets as needed

## 🔧 Setup Instructions:
1. Create each database using the structures above
2. Configure number properties to use DOP currency format (RD$ #,##0.00)
3. Add the formulas to calculated properties
4. Set up relations between databases
5. Create sample categories (Housing, Food, Transportation, etc.)
6. Add your bank accounts with current balances
7. Start logging transactions and set up recurring ones

## 🎯 Enhanced Version Features:
- Structured database properties in organized tables
- Added recurring transaction formula using dateAdd
- Specified DOP currency format throughout
- Enhanced visual hierarchy with markdown
- Improved formula readability
- Added color coding support notes  
- Added emoji indicators for quick scanning

Created by Bebell Digital Solutions
Template Version 2.0 - Enhanced with DOP Support & Recurring Transactions
            `.trim();

            navigator.clipboard.writeText(templateText).then(() => {
                showToast('Enhanced Notion template copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Failed to copy template text', 'error');
            });
        }
        
        
      
        
        
        
        

        // 5. EMAIL NOTIFICATIONS IMPLEMENTATION
        function initializeEmailJS() {
            // Initialize EmailJS with your public key
            // You'll need to replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
            if (typeof emailjs !== 'undefined') {
                emailjs.init('pzi6GkEVpxFMX_PUe'); // Replace with your EmailJS public key
                emailJS = emailjs;
            }
        }

        function setupEmailNotificationToggle() {
            const emailToggle = document.getElementById('email-notifications');
            const emailSettings = document.getElementById('email-settings');
            
            if (emailToggle && emailSettings) {
                emailToggle.addEventListener('change', function() {
                    if (this.checked) {
                        emailSettings.classList.remove('hidden');
                    } else {
                        emailSettings.classList.add('hidden');
                    }
                });
            }
        }

        function setupEmailNotifications() {
            const emailAddress = document.getElementById('notification-email').value;
            const frequency = document.getElementById('notification-frequency').value;
            
            if (!emailAddress) {
                showToast('Please enter your email address', 'error');
                return;
            }
            
            if (!emailJS) {
                showEmailSetupGuide();
                return;
            }
            
            // Save email settings
            financialData.updateSettings({
                emailNotifications: true,
                notificationEmail: emailAddress,
                notificationFrequency: frequency
            });
            
            // Send test email
            sendTestEmail(emailAddress);
        }

        function sendTestEmail(email) {
            if (!emailJS) {
                showToast('EmailJS not configured', 'error');
                return;
            }

            const templateParams = {
                to_email: email,
                subject: 'Financial Dashboard - Email Notifications Activated',
                message: 'Your email notifications have been successfully set up! You will receive reminders based on your preferences.'
            };

            emailJS.send('BebellDigitalSolutions', 'bebell_notifications', templateParams)
                .then(() => {
                    showToast('Test email sent successfully!', 'success');
                })
                .catch(() => {
                    showToast('Failed to send test email. Please check your EmailJS configuration.', 'error');
                });
        }

        function sendBillReminder(bill) {
            if (!financialData.settings.emailNotifications || !financialData.settings.notificationEmail || !emailJS) {
                return;
            }

            const templateParams = {
                to_email: financialData.settings.notificationEmail,
                subject: `Bill Reminder: ${bill.name}`,
                message: `Don't forget! Your bill "${bill.name}" is due on ${formatDate(bill.dueDate)}. Amount: ${formatCurrency(bill.amount)}`
            };

            emailJS.send('BebellDigitalSolutions', 'bebell_notifications', templateParams)
                .catch(error => console.error('Failed to send bill reminder:', error));
        }

        function sendBudgetAlert(category, spent, budget) {
            if (!financialData.settings.emailNotifications || !financialData.settings.notificationEmail || !emailJS) {
                return;
            }

            const percentage = (spent / budget * 100).toFixed(1);
            const templateParams = {
                to_email: financialData.settings.notificationEmail,
                subject: `Budget Alert: ${category}`,
                message: `You've spent ${formatCurrency(spent)} (${percentage}%) of your ${formatCurrency(budget)} budget for ${category}.`
            };

            emailJS.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .catch(error => console.error('Failed to send budget alert:', error));
        }

        function showEmailSetupGuide() {
            const guideText = `
EMAIL NOTIFICATION SETUP GUIDE

To enable email notifications, you need to set up EmailJS:

1. CREATE EMAILJS ACCOUNT:
   - Go to https://emailjs.com
   - Sign up for a free account
   - Verify your email address

2. CREATE EMAIL SERVICE:
   - In EmailJS dashboard, go to "Email Services"
   - Add your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions

3. CREATE EMAIL TEMPLATE:
   - Go to "Email Templates"
   - Create a new template with these variables:
     - {{to_email}} - Recipient email
     - {{subject}} - Email subject
     - {{message}} - Email content

4. UPDATE DASHBOARD CODE:
   - Replace 'YOUR_PUBLIC_KEY' with your EmailJS public key
   - Replace 'YOUR_SERVICE_ID' with your service ID
   - Replace 'YOUR_TEMPLATE_ID' with your template ID

5. NOTIFICATION TYPES:
   - Budget alerts when spending exceeds 80% of budget
   - Bill reminders 3 days before due date
   - Goal milestone achievements
   - Weekly/daily financial summaries

TECHNICAL REQUIREMENTS:
- EmailJS account (free tier: 200 emails/month)
- Valid email service configuration
- Internet connection for sending emails

PRIVACY & SECURITY:
- Emails are sent directly through EmailJS
- No financial data is stored on external servers
- You control all email templates and content

After completing setup, return to settings and enter your email address to activate notifications.
            `;
            
            alert(guideText);
        }



        // Enhanced notification system
        function checkBudgetAlerts() {
            if (!financialData.settings.budgetAlerts) return;
            
            const currentDate = new Date();
            financialData.categories.filter(c => c.budget > 0).forEach(category => {
                const spent = Math.abs(financialData.transactions
                    .filter(t => {
                        const tDate = new Date(t.date);
                        return t.type === 'expense' && 
                               t.category === category.name &&
                               tDate.getMonth() === currentDate.getMonth() &&
                               tDate.getFullYear() === currentDate.getFullYear();
                    })
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0));
                
                const percentage = (spent / category.budget) * 100;
                
                
                
                
                
                // Send alert if spending exceeds 80%
                if (percentage >= 80 && percentage < 100) {
                    sendBudgetAlert(category.name, spent, category.budget);
                }
            });
        }

        function checkBillReminders() {
            if (!financialData.settings.billReminders) return;
            
            const today = new Date();
            const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
            
            financialData.bills.forEach(bill => {
                const dueDate = new Date(bill.dueDate);
                if (dueDate <= threeDaysFromNow && dueDate >= today) {
                    sendBillReminder(bill);
                }
            });
        }

        // Rest of the existing functions (theme management, navigation, data loading, etc.)
        // These remain exactly the same as in the previous version...

        // Theme management
        function applyTheme() {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
                document.getElementById('theme-icon').setAttribute('data-lucide', 'moon');
            } else {
                document.documentElement.classList.remove('dark');
                document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
            }
            lucide.createIcons();
        }

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            
            if (isDarkMode) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            
            applyTheme();
            
            // Reinitialize charts with new theme
            setTimeout(() => {
                initCharts();
            }, 100);
        }

        // Navigation Functions
        function showSection(sectionName) {
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.add('hidden');
            });

            // Show selected section
            const targetSection = document.getElementById(sectionName + '-section');
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('fade-in');
            }

            // Update navigation active state
            const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
                item.classList.remove('bg-primary-50', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-300');
                item.classList.add('text-gray-700', 'dark:text-gray-300');
            });
            
            
            
            

            // Add active state to current nav item
            const activeNavItems = document.querySelectorAll(`[onclick*="showSection('${sectionName}')"]`);
            activeNavItems.forEach(item => {
                item.classList.add('active');
                item.classList.add('bg-primary-50', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-300');
                item.classList.remove('text-gray-700', 'dark:text-gray-300');
            });

            currentSection = sectionName;




            // Load section-specific data
            loadSectionData(sectionName);
        }

        function loadSectionData(sectionName) {
            switch(sectionName) {
                case 'overview':
                    loadOverviewData();
                    break;
                case 'accounts':
                    loadAccounts();
                    break;
                case 'transactions':
                    loadTransactions();
                    break;
                case 'budgets':
                    loadBudgets();
                    break;
                case 'reports':
                    loadReports();
                    break;
                case 'calendar':
                    loadCalendar();
                    break;
            }
        }

        function loadAllData() {
            loadOverviewData();
            loadAccounts();
            loadTransactions();
            loadBudgets();
            loadReports();
            loadCalendar();
        }
        
        
        
        

        // Mobile Menu Functions
        function toggleMobileMenu() {
            const overlay = document.getElementById('mobile-overlay');
            const sidebar = document.getElementById('mobile-sidebar');
            const menuIcon = document.getElementById('mobile-menu-icon');

            if (overlay.classList.contains('hidden')) {
                overlay.classList.remove('hidden');
                sidebar.classList.remove('-translate-x-full');
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                overlay.classList.add('hidden');
                sidebar.classList.add('-translate-x-full');
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            
            lucide.createIcons();
        }
        
        
        
        

        // Modal Functions
        function openAddTransactionModal() {
            showModal('add-transaction-modal');
        }

        function openAddAccountModal() {
            showModal('add-account-modal');
        }

        function openAddBudgetModal() {
            showModal('add-budget-modal');
        }

        function openAddGoalModal() {
            showModal('add-goal-modal');
        }

        function showModal(modalId) {
            document.getElementById('modal-backdrop').classList.remove('hidden');
            document.getElementById(modalId).classList.remove('hidden');
            
            
            
            
            
            // Focus first input in modal
            setTimeout(() => {
                const firstInput = document.querySelector(`#${modalId} input, #${modalId} select`);
                if (firstInput) firstInput.focus();
            }, 100);
        }

        function closeModal(modalId) {
            document.getElementById('modal-backdrop').classList.add('hidden');
            document.getElementById(modalId).classList.add('hidden');
        }

        function closeAllModals() {
            document.getElementById('modal-backdrop').classList.add('hidden');
            const modals = document.querySelectorAll('[id$="-modal"]');
            modals.forEach(modal => {
                modal.classList.add('hidden');
            });
        }
        
        
        
        

        // Toast notification
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toast-message');
            
            toastMessage.textContent = message;
            
            
            
            // Set toast color based on type
            toast.className = 'toast show px-6 py-3 rounded-lg shadow-lg';
            if (type === 'success') {
                toast.classList.add('bg-green-500', 'text-white');
            } else if (type === 'error') {
                toast.classList.add('bg-red-500', 'text-white');
            } else if (type === 'info') {
                toast.classList.add('bg-blue-500', 'text-white');
            }
            
            
            
            // Hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
            }, 3000);
        }



        // Data Loading Functions (keeping existing ones)
        function loadOverviewData() {
            const totalBalance = financialData.accounts.reduce((sum, account) => sum + account.balance, 0);
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            
            const monthlyIncome = financialData.transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'income' && 
                           tDate.getMonth() === currentMonth && 
                           tDate.getFullYear() === currentYear;
                })
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                
            const monthlyExpenses = financialData.transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'expense' && 
                           tDate.getMonth() === currentMonth && 
                           tDate.getFullYear() === currentYear;
                })
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                
            const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1) : 0;

            
            
            // Update UI
            document.getElementById('total-balance').textContent = formatCurrency(totalBalance);
            document.getElementById('monthly-income').textContent = formatCurrency(monthlyIncome);
            document.getElementById('monthly-expenses').textContent = formatCurrency(monthlyExpenses);
            document.getElementById('savings-rate').textContent = savingsRate + '%';

            // Load recent transactions and goals
            loadRecentTransactions();
            loadFinancialGoals();
            
            // Check for alerts
            checkBudgetAlerts();
            checkBillReminders();
        }

        function loadRecentTransactions() {
            const container = document.getElementById('recent-transactions');
            const recentTransactions = financialData.transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            if (recentTransactions.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i data-lucide="credit-card" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                        <p>No transactions yet. Add your first transaction to get started!</p>
                    </div>
                `;
            } else {
                container.innerHTML = recentTransactions.map(transaction => {
                    const account = financialData.accounts.find(a => a.id === transaction.account);
                    const isExpense = transaction.type === 'expense';
                    const amountClass = isExpense ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400';
                    
                    return `
                        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                    <i data-lucide="${getTransactionIcon(transaction.type)}" class="w-5 h-5 text-gray-600 dark:text-gray-400"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">${transaction.description}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">${account?.name || 'Unknown Account'} • ${formatDate(transaction.date)}</p>
                                </div>
                            </div>
                            <p class="font-semibold ${amountClass}">${formatCurrency(Math.abs(transaction.amount))}</p>
                        </div>
                    `;
                }).join('');
            }

            lucide.createIcons();
        }

        function loadFinancialGoals() {
            const container = document.getElementById('financial-goals');
            
            if (financialData.goals.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400 col-span-full">
                        <i data-lucide="target" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                        <p>No goals set yet. Add your first financial goal!</p>
                    </div>
                `;
            } else {
                container.innerHTML = financialData.goals.map(goal => {
                    const progress = goal.target > 0 ? (goal.current / goal.target * 100).toFixed(1) : 0;
                    
                    return `
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-medium text-gray-900 dark:text-white">${goal.name}</h4>
                                <span class="text-sm text-gray-500 dark:text-gray-400">${progress}%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                                <div class="bg-primary-600 h-2 rounded-full progress-bar" style="width: ${progress}%"></div>
                            </div>
                            <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>${formatCurrency(goal.current)}</span>
                                <span>${formatCurrency(goal.target)}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        function loadAccounts() {
            const container = document.getElementById('accounts-grid');
            if (!container) return;
            
            if (financialData.accounts.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 text-gray-500 dark:text-gray-400 col-span-full">
                        <i data-lucide="building-2" class="w-16 h-16 mx-auto mb-4 opacity-50"></i>
                        <p class="text-xl mb-2">No accounts yet</p>
                        <p>Add your first account to start tracking your finances!</p>
                        <button onclick="openAddAccountModal()" class="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                            Add Account
                        </button>
                    </div>
                `;
            } else {
                container.innerHTML = financialData.accounts.map(account => {
                    const isCredit = account.type === 'credit';
                    const balanceClass = account.balance < 0 ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400';
                    
                    return `
                        <div class="card-hover bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                                    <i data-lucide="${getAccountIcon(account.type)}" class="w-6 h-6 text-primary-600 dark:text-primary-400"></i>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">${account.bank}</p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 uppercase">${account.type}</p>
                                </div>
                            </div>
                            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">${account.name}</h3>
                            <p class="text-2xl font-bold ${balanceClass} mb-2">${formatCurrency(Math.abs(account.balance))}</p>
                            ${isCredit && account.limit ? `
                                <div class="mt-4">
                                    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        <span>Credit Used</span>
                                        <span>${(Math.abs(account.balance) / account.limit * 100).toFixed(1)}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                        <div class="bg-primary-600 h-2 rounded-full" style="width: ${Math.abs(account.balance) / account.limit * 100}%"></div>
                                    </div>
                                </div>
                            ` : ''}
                            <div class="mt-4 flex space-x-2">
                                <button onclick="editAccount(${account.id})" class="flex-1 text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Edit
                                </button>
                                <button onclick="deleteAccount(${account.id})" class="flex-1 text-sm px-3 py-2 text-danger-600 border border-danger-300 rounded-lg hover:bg-danger-50">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            lucide.createIcons();
        }

        function loadTransactions() {
            const tbody = document.getElementById('transactions-table-body');
            if (!tbody) return;
            
            if (financialData.transactions.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center">
                            <div class="text-gray-500 dark:text-gray-400">
                                <i data-lucide="credit-card" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                                <p class="text-lg mb-2">No transactions yet</p>
                                <p>Start by adding your first transaction!</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                const filteredTransactions = getFilteredTransactions();
                tbody.innerHTML = filteredTransactions.map(transaction => {
                    const account = financialData.accounts.find(a => a.id === transaction.account);
                    const isExpense = transaction.type === 'expense';
                    const amountClass = isExpense ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400';
                    
                    return `
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${formatDate(transaction.date)}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                        <i data-lucide="${getTransactionIcon(transaction.type)}" class="w-4 h-4 text-gray-600 dark:text-gray-400"></i>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">${transaction.description}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    ${transaction.category || 'Uncategorized'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${account?.name || 'Unknown'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${amountClass}">${formatCurrency(Math.abs(transaction.amount))}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 space-x-2">
                                <button onclick="editTransaction(${transaction.id})" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">Edit</button>
                                <button onclick="deleteTransaction(${transaction.id})" class="text-danger-600 dark:text-danger-400 hover:text-danger-900 dark:hover:text-danger-300">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            lucide.createIcons();
        }

        function loadBudgets() {
            const container = document.getElementById('budgets-grid');
            if (!container) return;
            
            if (financialData.categories.filter(c => c.budget > 0).length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 text-gray-500 dark:text-gray-400 col-span-full">
                        <i data-lucide="pie-chart" class="w-16 h-16 mx-auto mb-4 opacity-50"></i>
                        <p class="text-xl mb-2">No budgets set</p>
                        <p>Create your first budget to start tracking your spending!</p>
                        <button onclick="openAddBudgetModal()" class="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                            Add Budget
                        </button>
                    </div>
                `;
            } else {
                const currentDate = new Date();
                container.innerHTML = financialData.categories.filter(c => c.budget > 0).map(category => {
                    const spent = Math.abs(financialData.transactions
                        .filter(t => {
                            const tDate = new Date(t.date);
                            return t.type === 'expense' && 
                                   t.category === category.name &&
                                   tDate.getMonth() === currentDate.getMonth() &&
                                   tDate.getFullYear() === currentDate.getFullYear();
                        })
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0));
                    const remaining = Math.max(0, category.budget - spent);
                    const progress = category.budget > 0 ? (spent / category.budget * 100).toFixed(1) : 0;
                    const isOverBudget = spent > category.budget;
                    
                    return `
                        <div class="card-hover bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center">
                                    <div class="w-3 h-3 rounded-full mr-3" style="background-color: ${category.color}"></div>
                                    <h3 class="font-semibold text-gray-900 dark:text-white">${category.name}</h3>
                                </div>
                                <span class="text-sm text-gray-500 dark:text-gray-400">${progress}%</span>
                            </div>
                            
                            <div class="mb-4">
                                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Spent: ${formatCurrency(spent)}</span>
                                    <span>Budget: ${formatCurrency(category.budget)}</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                    <div class="h-2 rounded-full progress-bar ${isOverBudget ? 'bg-danger-500' : 'bg-primary-600'}" 
                                         style="width: ${Math.min(100, progress)}%"></div>
                                </div>
                            </div>
                            
                            <div class="text-center">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    ${isOverBudget ? 'Over budget by' : 'Remaining'}: 
                                    <span class="font-semibold ${isOverBudget ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}">
                                        ${formatCurrency(Math.abs(remaining))}
                                    </span>
                                </p>
                            </div>
                            
                            <div class="mt-4 flex space-x-2">
                                <button onclick="editBudget(${category.id})" class="flex-1 text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Edit
                                </button>
                                <button onclick="deleteBudget(${category.id})" class="flex-1 text-sm px-3 py-2 text-danger-600 border border-danger-300 rounded-lg hover:bg-danger-50">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
        
        
        

        function loadReports() {
            // Reports data will be loaded when charts are initialized
        }

        function loadUpcomingEvents() {
            // Load upcoming bills
            const upcomingBills = document.getElementById('upcoming-bills');
            if (upcomingBills) {
                upcomingBills.innerHTML = `
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i data-lucide="calendar-check" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                        <p>No upcoming bills</p>
                    </div>
                `;
            }

            // Load goal milestones
            const goalMilestones = document.getElementById('goal-milestones');
            if (goalMilestones) {
                if (financialData.goals.length > 0) {
                    goalMilestones.innerHTML = financialData.goals.slice(0, 3).map(goal => {
                        const progress = goal.target > 0 ? (goal.current / goal.target * 100).toFixed(1) : 0;
                        return `
                            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                                        <i data-lucide="target" class="w-4 h-4 text-primary-600 dark:text-primary-400"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">${goal.name}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Target: ${formatDate(goal.deadline)}</p>
                                    </div>
                                </div>
                                <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">${progress}%</span>
                            </div>
                        `;
                    }).join('');
                } else {
                    goalMilestones.innerHTML = `
                        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                            <i data-lucide="target" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                            <p>No goal milestones</p>
                        </div>
                    `;
                }
            }

            lucide.createIcons();
        }

        // Calendar Navigation
        function previousMonth() {
            if (currentMonth === 0) {
                currentMonth = 11;
                currentYear--;
            } else {
                currentMonth--;
            }
            loadCalendar();
        }

        function nextMonth() {
            if (currentMonth === 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
            loadCalendar();
        }

        // Settings Functions
        function showSettingsTab(tabName) {
            // Hide all settings content
            const settingsContents = document.querySelectorAll('.settings-content');
            settingsContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Show selected settings content
            const targetContent = document.getElementById(tabName + '-settings');
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }

            // Update tab active state
            const settingsTabs = document.querySelectorAll('.settings-tab');
            settingsTabs.forEach(tab => {
                tab.classList.remove('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
                tab.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            });

            // Add active state to current tab
            const activeTab = document.querySelector(`[onclick="showSettingsTab('${tabName}')"]`);
            if (activeTab) {
                activeTab.classList.add('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
                activeTab.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
            }
        }

        function loadSettings() {
            document.getElementById('theme-select').value = financialData.settings.theme;
            document.getElementById('currency-select').value = financialData.settings.currency;
            document.getElementById('date-format-select').value = financialData.settings.dateFormat;
            document.getElementById('budget-alerts').checked = financialData.settings.budgetAlerts;
            document.getElementById('bill-reminders').checked = financialData.settings.billReminders;
            document.getElementById('goal-progress').checked = financialData.settings.goalProgress;
            document.getElementById('email-notifications').checked = financialData.settings.emailNotifications;
            document.getElementById('notification-email').value = financialData.settings.notificationEmail;
            document.getElementById('notification-frequency').value = financialData.settings.notificationFrequency;
            document.getElementById('two-factor').checked = financialData.settings.twoFactor;
            
            // Show email settings if enabled
            if (financialData.settings.emailNotifications) {
                document.getElementById('email-settings').classList.remove('hidden');
            }
        }

        function handleThemeChange() {
            const themeSelect = document.getElementById('theme-select');
            const selectedTheme = themeSelect.value;
            
            financialData.updateSettings({ theme: selectedTheme });
            
            if (selectedTheme === 'system') {
                isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                localStorage.removeItem('theme');
            } else {
                isDarkMode = selectedTheme === 'dark';
                localStorage.setItem('theme', selectedTheme);
            }
            
            applyTheme();
            setTimeout(() => initCharts(), 100);
        }

        function handleCurrencyChange() {
            const currency = document.getElementById('currency-select').value;
            financialData.updateSettings({ currency });
            loadAllData(); // Refresh all displays
        }

        function handleDateFormatChange() {
            const dateFormat = document.getElementById('date-format-select').value;
            financialData.updateSettings({ dateFormat });
            loadAllData(); // Refresh all displays
        }

        // CRUD Operations
        function editAccount(id) {
            const account = financialData.accounts.find(a => a.id === id);
            if (account) {
                // Populate form with account data
                document.getElementById('account-name').value = account.name;
                document.getElementById('account-type').value = account.type;
                document.getElementById('account-bank').value = account.bank;
                document.getElementById('account-balance').value = account.balance;
                if (account.limit) {
                    document.getElementById('account-limit').value = account.limit;
                }
                
                // Store ID for update
                document.getElementById('account-form').dataset.editId = id;
                
                showModal('add-account-modal');
            }
        }

        function deleteAccount(id) {
            if (confirm('Are you sure you want to delete this account? This will also remove all associated transactions.')) {
                // Remove associated transactions
                financialData.transactions = financialData.transactions.filter(t => t.account !== id);
                financialData.saveToStorage('transactions', financialData.transactions);
                
                // Remove account
                financialData.deleteAccount(id);
                
                loadAllData();
                showToast('Account deleted successfully');
            }
        }

        function editTransaction(id) {
            const transaction = financialData.transactions.find(t => t.id === id);
            if (transaction) {
                // Populate form
                document.getElementById('transaction-type').value = transaction.type;
                document.getElementById('transaction-amount').value = Math.abs(transaction.amount);
                document.getElementById('transaction-description').value = transaction.description;
                document.getElementById('transaction-category').value = transaction.category;
                document.getElementById('transaction-account').value = transaction.account;
                document.getElementById('transaction-date').value = transaction.date;
                
                // Store ID for update
                document.getElementById('transaction-form').dataset.editId = id;
                
                showModal('add-transaction-modal');
            }
        }

        function deleteTransaction(id) {
            if (confirm('Are you sure you want to delete this transaction?')) {
                financialData.deleteTransaction(id);
                loadAllData();
                showToast('Transaction deleted successfully');
            }
        }

        function editBudget(id) {
            const category = financialData.categories.find(c => c.id === id);
            if (category) {
                document.getElementById('budget-category').value = category.name;
                document.getElementById('budget-amount').value = category.budget;
                document.getElementById('budget-color').value = category.color;
                
                // Store ID for update
                document.getElementById('budget-form').dataset.editId = id;
                
                showModal('add-budget-modal');
            }
        }

        function deleteBudget(id) {
            if (confirm('Are you sure you want to delete this budget?')) {
                const index = financialData.categories.findIndex(c => c.id === id);
                if (index !== -1) {
                    financialData.categories[index].budget = 0;
                    financialData.saveToStorage('categories', financialData.categories);
                }
                loadBudgets();
                showToast('Budget deleted successfully');
            }
        }

        // Filtering
        function getFilteredTransactions() {
            const searchTerm = document.getElementById('transaction-search').value.toLowerCase();
            const typeFilter = document.getElementById('transaction-type-filter').value;
            const categoryFilter = document.getElementById('transaction-category-filter').value;
            const accountFilter = parseInt(document.getElementById('transaction-account-filter').value);

            return financialData.transactions
                .filter(transaction => {
                    const matchesSearch = !searchTerm || 
                        transaction.description.toLowerCase().includes(searchTerm) ||
                        transaction.category?.toLowerCase().includes(searchTerm);
                    const matchesType = !typeFilter || transaction.type === typeFilter;
                    const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
                    const matchesAccount = !accountFilter || transaction.account === accountFilter;
                    
                    return matchesSearch && matchesType && matchesCategory && matchesAccount;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        function filterTransactions() {
            loadTransactions();
        }

        // Chart Functions
        function initCharts() {
            initSpendingChart();
            initBudgetChart();
            initIncomeExpenseChart();
            initCategoryDistributionChart();
        }

        function initSpendingChart() {
            const ctx = document.getElementById('spending-chart');
            if (!ctx) return;

            const chart = Chart.getChart(ctx);
            if (chart) {
                chart.destroy();
            }

            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#f9fafb' : '#1f2937';
            const gridColor = isDark ? '#374151' : '#e5e7eb';

            // Calculate last 6 months spending
            const monthlySpending = [];
            const monthLabels = [];
            const currentDate = new Date();
            
            for (let i = 5; i >= 0; i--) {
                const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                monthLabels.push(month.toLocaleDateString('en-US', { month: 'short' }));
                
                const spending = financialData.transactions
                    .filter(t => {
                        const tDate = new Date(t.date);
                        return t.type === 'expense' && 
                               tDate.getMonth() === month.getMonth() && 
                               tDate.getFullYear() === month.getFullYear();
                    })
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    
                monthlySpending.push(spending);
            }

            charts.spending = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: monthLabels,
                    datasets: [{
                        label: 'Expenses',
                        data: monthlySpending,
                        borderColor: '#DF1783',
                        backgroundColor: 'rgba(223, 23, 131, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: textColor
                            }
                        },
                        y: {
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: textColor,
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        function initBudgetChart() {
            const ctx = document.getElementById('budget-chart');
            if (!ctx) return;

            const chart = Chart.getChart(ctx);
            if (chart) {
                chart.destroy();
            }

            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#f9fafb' : '#1f2937';

            const categoriesWithBudgets = financialData.categories.filter(c => c.budget > 0);
            
            if (categoriesWithBudgets.length === 0) {
                // Show no data message
                ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
                return;
            }

            charts.budget = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: categoriesWithBudgets.map(c => c.name),
                    datasets: [{
                        data: categoriesWithBudgets.map(c => c.budget),
                        backgroundColor: categoriesWithBudgets.map(c => c.color),
                        borderWidth: 2,
                        borderColor: isDark ? '#1f2937' : '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                padding: 20
                            }
                        }
                    }
                }
            });
        }

        function initIncomeExpenseChart() {
            const ctx = document.getElementById('income-expense-chart');
            if (!ctx) return;

            const chart = Chart.getChart(ctx);
            if (chart) {
                chart.destroy();
            }

            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#f9fafb' : '#1f2937';
            const gridColor = isDark ? '#374151' : '#e5e7eb';

            // Calculate last 6 months income and expenses
            const monthlyIncome = [];
            const monthlyExpenses = [];
            const monthLabels = [];
            const currentDate = new Date();
            
            for (let i = 5; i >= 0; i--) {
                const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                monthLabels.push(month.toLocaleDateString('en-US', { month: 'short' }));
                
                const income = financialData.transactions
                    .filter(t => {
                        const tDate = new Date(t.date);
                        return t.type === 'income' && 
                               tDate.getMonth() === month.getMonth() && 
                               tDate.getFullYear() === month.getFullYear();
                    })
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    
                const expenses = financialData.transactions
                    .filter(t => {
                        const tDate = new Date(t.date);
                        return t.type === 'expense' && 
                               tDate.getMonth() === month.getMonth() && 
                               tDate.getFullYear() === month.getFullYear();
                    })
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                    
                monthlyIncome.push(income);
                monthlyExpenses.push(expenses);
            }

            charts.incomeExpense = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: monthLabels,
                    datasets: [
                        {
                            label: 'Income',
                            data: monthlyIncome,
                            backgroundColor: '#10b981'
                        },
                        {
                            label: 'Expenses',
                            data: monthlyExpenses,
                            backgroundColor: '#DF1783'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: textColor
                            }
                        },
                        y: {
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: textColor,
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        function initCategoryDistributionChart() {
            const ctx = document.getElementById('category-distribution-chart');
            if (!ctx) return;

            const chart = Chart.getChart(ctx);
            if (chart) {
                chart.destroy();
            }

            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#f9fafb' : '#1f2937';




            // Calculate spending by category for current month
            const currentDate = new Date();
            const categorySpending = [];
            const categoryNames = [];
            const categoryColors = [];
            
            financialData.categories.forEach(category => {
                const spent = Math.abs(financialData.transactions
                    .filter(t => {
                        const tDate = new Date(t.date);
                        return t.type === 'expense' && 
                               t.category === category.name &&
                               tDate.getMonth() === currentDate.getMonth() &&
                               tDate.getFullYear() === currentDate.getFullYear();
                    })
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0));
                    
                if (spent > 0) {
                    categorySpending.push(spent);
                    categoryNames.push(category.name);
                    categoryColors.push(category.color);
                }
            });

            if (categorySpending.length === 0) {
                // Show no data message
                ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
                return;
            }

            charts.categoryDistribution = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: categoryNames,
                    datasets: [{
                        data: categorySpending,
                        backgroundColor: categoryColors,
                        borderWidth: 2,
                        borderColor: isDark ? '#1f2937' : '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                padding: 20
                            }
                        }
                    }
                }
            });
        }

        function generateReport() {
            // Regenerate charts with current data
            initIncomeExpenseChart();
            initCategoryDistributionChart();
            showToast('Report generated successfully!');
        }
        
        
        
        
        

        // Data Import/Export
        function exportData(format) {
            if (format === 'csv') {
                exportToCSV();
            } else if (format === 'pdf') {
                showToast('PDF export feature coming soon!', 'info');
            }
        }

        function exportToCSV() {
            const csvContent = [
                ['Date', 'Type', 'Description', 'Category', 'Account', 'Amount'],
                ...financialData.transactions.map(t => {
                    const account = financialData.accounts.find(a => a.id === t.account);
                    return [t.date, t.type, t.description, t.category || '', account?.name || '', t.amount];
                })
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'financial_data.csv';
            a.click();
            window.URL.revokeObjectURL(url);
            
            showToast('Data exported to CSV successfully!');
        }

        function importData() {
            const file = document.getElementById('import-file').files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',');
                    
                    
                    
                    
                    // Basic CSV parsing (simplified)
                    for (let i = 1; i < lines.length; i++) {
                        const data = lines[i].split(',');
                        if (data.length >= 6) {
                            const transaction = {
                                date: data[0],
                                type: data[1],
                                description: data[2],
                                category: data[3],
                                account: 1, // Default to first account
                                amount: parseFloat(data[5])
                            };
                            financialData.addTransaction(transaction);
                        }
                    }
                    
                    loadAllData();
                    showToast('Data imported successfully!');
                } catch (error) {
                    showToast('Error importing data. Please check file format.', 'error');
                }
            };
            reader.readAsText(file);
        }

        function resetAllData() {
            if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
                financialData.clearAllData();
                financialData = new FinancialData(); // Reinitialize
                loadAllData();
                populateDropdowns();
                initCharts();
                showToast('All data has been reset');
            }
        }







         // Form Handlers
        function setupFormHandlers() {
            
            // Transaction form
           document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('transaction-type').value,
        amount: parseFloat(document.getElementById('transaction-amount').value),
        description: document.getElementById('transaction-description').value,
        category: document.getElementById('transaction-category').value,
        account: parseInt(document.getElementById('transaction-account').value),
        date: document.getElementById('transaction-date').value
    };
    
                
                
                
                
             // Validate required fields
    if (!formData.amount || !formData.description || !formData.account || !formData.date) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const editId = this.dataset.editId;
    const isRecurring = document.getElementById('transaction-recurring').checked;
    const signedAmount = formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
    
    if (editId) {
                
                
                
                
                
                
                
                
                                // Update existing transaction
            formData.amount = formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
            financialData.updateTransaction(parseInt(editId), formData);
            showToast('Transaction updated successfully!');
            delete this.dataset.editId;
        } else {
            // Handle recurring transactions
            const isRecurring = document.getElementById('transaction-recurring').checked;
            const signedAmount = formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
            
            if (isRecurring) {
                const frequency = document.getElementById('transaction-frequency').value;
                const times = parseInt(document.getElementById('transaction-times').value) || 1;
                let baseDate = new Date(formData.date);
                
                for (let i = 0; i < times; i++) {
                    const transaction = { ...formData };
                    transaction.date = baseDate.toISOString().split('T')[0];
                    transaction.amount = signedAmount;
                    financialData.addTransaction(transaction);
                    
                    // Increment date based on frequency
                    switch(frequency) {
                        case 'daily': baseDate.setDate(baseDate.getDate() + 1); break;
                        case 'weekly': baseDate.setDate(baseDate.getDate() + 7); break;
                        case 'biweekly': baseDate.setDate(baseDate.getDate() + 14); break;
                        case 'monthly': baseDate.setMonth(baseDate.getMonth() + 1); break;
                        case 'quarterly': baseDate.setMonth(baseDate.getMonth() + 3); break;
                        case 'yearly': baseDate.setFullYear(baseDate.getFullYear() + 1); break;
                    }
                }
            } else {
            
            
            
            // Add single transaction
                formData.amount = signedAmount;
                financialData.addTransaction(formData);
            }
            
            showToast('Transaction(s) added successfully!');
        }
        
        loadAllData();
        initCharts();
        closeModal('add-transaction-modal');
        this.reset();
        document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
    });

    // Add recurring toggle handler
    document.getElementById('transaction-recurring').addEventListener('change', function() {
        document.getElementById('recurring-options').classList.toggle('hidden', !this.checked);
    });    
                
                
                

            
            
            

            // Account form
            document.getElementById('account-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('account-name').value,
                    type: document.getElementById('account-type').value,
                    bank: document.getElementById('account-bank').value,
                    balance: parseFloat(document.getElementById('account-balance').value) || 0
                };
                
                if (formData.type === 'credit') {
                    formData.limit = parseFloat(document.getElementById('account-limit').value) || 0;
                }
                
                // Validate required fields
                if (!formData.name || !formData.type || !formData.bank) {
                    showToast('Please fill in all required fields', 'error');
                    return;
                }
                
                const editId = this.dataset.editId;
                
                if (editId) {
                    // Update existing account
                    financialData.updateAccount(parseInt(editId), formData);
                    showToast('Account updated successfully!');
                    delete this.dataset.editId;
                } else {
                    // Add new account
                    financialData.addAccount(formData);
                    showToast('Account added successfully!');
                }
                
                loadAllData();
                populateDropdowns();
                closeModal('add-account-modal');
                this.reset();
            });






            // Budget form
            document.getElementById('budget-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const categoryName = document.getElementById('budget-category').value;
                const budgetAmount = parseFloat(document.getElementById('budget-amount').value);
                const budgetColor = document.getElementById('budget-color').value;
                
                if (!categoryName || !budgetAmount) {
                    showToast('Please fill in all required fields', 'error');
                    return;
                }
                
                const editId = this.dataset.editId;
                
                if (editId) {
                    // Update existing category
                    const index = financialData.categories.findIndex(c => c.id === parseInt(editId));
                    if (index !== -1) {
                        financialData.categories[index] = {
                            ...financialData.categories[index],
                            name: categoryName,
                            budget: budgetAmount,
                            color: budgetColor
                        };
                        financialData.saveToStorage('categories', financialData.categories);
                    }
                    showToast('Budget updated successfully!');
                    delete this.dataset.editId;
                } else {
                    // Add new category
                    const newCategory = {
                        name: categoryName,
                        budget: budgetAmount,
                        color: budgetColor
                    };
                    financialData.addCategory(newCategory);
                    showToast('Budget added successfully!');
                }
                
                loadBudgets();
                populateDropdowns();
                initCharts();
                closeModal('add-budget-modal');
                this.reset();
            });





            // Goal form
            document.getElementById('goal-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('goal-name').value,
                    target: parseFloat(document.getElementById('goal-target').value),
                    current: parseFloat(document.getElementById('goal-current').value) || 0,
                    deadline: document.getElementById('goal-deadline').value
                };
                
                if (!formData.name || !formData.target) {
                    showToast('Please fill in all required fields', 'error');
                    return;
                }
                
                financialData.addGoal(formData);
                showToast('Goal added successfully!');
                
                loadOverviewData();
                loadCalendar();
                closeModal('add-goal-modal');
                this.reset();
            });






            // Account type change handler
            document.getElementById('account-type').addEventListener('change', function() {
                const creditLimitField = document.getElementById('credit-limit-field');
                if (this.value === 'credit') {
                    creditLimitField.classList.remove('hidden');
                    document.getElementById('account-limit').required = true;
                } else {
                    creditLimitField.classList.add('hidden');
                    document.getElementById('account-limit').required = false;
                }
            });
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const format = financialData.settings.dateFormat || 'MM/DD/YYYY';
            
            if (format === 'DD/MM/YYYY') {
                return date.toLocaleDateString('en-GB');
            } else if (format === 'YYYY-MM-DD') {
                return date.toISOString().split('T')[0];
            } else {
                return date.toLocaleDateString('en-US');
            }
        }

        function getAccountIcon(type) {
            const icons = {
                'checking': 'building-2',
                'savings': 'piggy-bank',
                'business': 'briefcase',
                'credit': 'credit-card',
                'investment': 'trending-up'
            };
            return icons[type] || 'wallet';
        }

        function getTransactionIcon(type) {
            const icons = {
                'income': 'arrow-down-left',
                'expense': 'arrow-up-right',
                'transfer': 'arrow-right-left'
            };
            return icons[type] || 'circle';
        }

        function populateDropdowns() {
            // Populate category dropdowns
            const categorySelects = document.querySelectorAll('#transaction-category, #transaction-category-filter');
            categorySelects.forEach(select => {
                if (select) {
                    const currentValue = select.value;
                    select.innerHTML = '<option value="">Select Category</option>' +
                        financialData.categories.map(category => 
                            `<option value="${category.name}">${category.name}</option>`
                        ).join('');
                    select.value = currentValue; // Restore selection
                }
            });
            
            
       <script>     

            // Populate account dropdowns
            const accountSelects = document.querySelectorAll('#transaction-account, #transaction-account-filter');
            accountSelects.forEach(select => {
                if (select) {
                    const currentValue = select.value;
                    select.innerHTML = '<option value="">Select Account</option>' +
                        financialData.accounts.map(account => 
                            `<option value="${account.id}">${account.name}</option>`
                        ).join('');
                    select.value = currentValue; // Restore selection
                }
            });
        }

        // Initialize the application when the page loads
        document.addEventListener('DOMContentLoaded', init);

        // Handle system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (financialData.settings.theme === 'system') {
                isDarkMode = e.matches;
                applyTheme();
                setTimeout(() => initCharts(), 100);
            }
        });

        // Handle window resize for charts
        window.addEventListener('resize', function() {
            Object.values(charts).forEach(chart => {
                if (chart) chart.resize();
            });
        });

        // Schedule daily notifications check
        setInterval(() => {
            if (financialData.settings.emailNotifications) {
                checkBudgetAlerts();
                checkBillReminders();
            }
        }, 24 * 60 * 60 * 1000); // Check once per day
    </script>

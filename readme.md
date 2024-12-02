# برنامه چت با Firebase

این یک برنامه چت ساده است که به کاربران این امکان را می‌دهد تا پیام‌هایی را به صورت آنی ارسال و دریافت کنند. این برنامه از پایگاه داده Realtime Firebase برای ذخیره و بازیابی پیام‌ها استفاده می‌کند. کاربران می‌توانند نام خود را وارد کنند و با دیگران چت کنند و پیام‌های خود را به رنگ آبی و پیام‌های دیگران را به رنگ سبز مشاهده کنند.

## ویژگی‌ها

- **شناسایی کاربر**: کاربران قبل از ارسال پیام از آنها خواسته می‌شود تا نام خود را وارد کنند. پس از وارد کردن، نام در `localStorage` ذخیره می‌شود تا در بازدیدهای آینده نیازی به وارد کردن دوباره نباشد.
- **نمایش پیام‌ها**: پیام‌ها به صورت عمودی نمایش داده می‌شوند. پیام‌های شما به رنگ آبی و پیام‌های دیگران به رنگ سبز نمایش داده می‌شوند.
- **چت آنی**: پیام‌ها در پایگاه داده Realtime Firebase ذخیره و به محض ارسال، به صفحه اضافه می‌شوند.
- **رابط کاربری ساده**: طراحی ساده و کاربرپسند برای ارتباط آسان.
- **نیاز به ورود نیست**: کاربران تنها به وارد کردن نام خود نیاز دارند و نیازی به احراز هویت نیست.

## تکنولوژی‌های استفاده شده

- **Firebase**: برای ذخیره و بازیابی پیام‌ها به صورت آنی استفاده می‌شود.
- **HTML/CSS/BOOTSTRAP**: برای ساختاردهی و طراحی صفحه وب.
- **JavaScript**: برای منطق ارسال، دریافت و نمایش پیام‌ها استفاده می‌شود.

 ## دمو

[مشاهده دموی سایت](https://hamidhosini.github.io/Chat/)
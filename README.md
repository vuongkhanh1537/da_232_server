
# ! Smart Home

Đây là server dành cho dự án Nhà ! thông minh

# Hướng dẫn cài đặt

## Cài đặt Docker

Sau khi clone mã nguồn về, hãy đảm bảo rằng bạn đã cài đặt docker để chúng ta không cần phải cài đặt quá nhiều môi trường

## Cài đặt yarn

Trong trường hợp đã cài đặt docker mà chương trình khởi chạy thất bại, hãy cài đặt yarn, mà chắc không cần đâu

## Khởi chạy chương trình

**Lưu ý**: Trước khi làm các bước dưới đây, hãy liên hệ Khánh để lấy file .env, hoặc server sẽ không thể chạy, cơ mà có khi nó lỗi linh tinh đâu đó nữa chứ không chỉ lỗi này ¯\\_(ツ)_/¯

Trong terminal, hãy nhập lệnh sau: **docker compose up --build** 

Quá trình này có thể mất vài phút nhằm việc build một container mới cứng, hãy kiên nhẫn và làm một tách cafe 

Sau khi khởi chạy hoàn tất, truy cập vào **http://localhost:3001/api/docs** để có thể nắm được các API của server

Nếu bạn có thể thấy giao diện Swagger thì việc khởi chạy hoàn tất, ở các lần tiếp theo, bạn chỉ cần chạy lệnh **docker compose up** là được

# Truy cập vào PGAdmin (GUI của postgesql)

Sau khi đã khởi chạy server, truy cập vào **http://localhost:8080/** để có thể truy cập vào pgAdmin4

Nhập thông tin dưới đây:

**username:** admin@admin.com

**password:** admin

Vậy là ta đã có thể truy cập vào pgAdmin để xem sự thay đổi trong db rồi

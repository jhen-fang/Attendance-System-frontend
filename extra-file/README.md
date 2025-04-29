# 說明

API Server 之編譯及執行指令

```
`mvn clean install`
`mvn spring-boot:run`
```

若在執行以上指令時遇到錯誤導致無法啟動，請嘗試以下步驟

1. 用 ```Attendance-System-frontend/extra-file/application.properties``` 取代
   ```Attendance-System-API/src/main/resources/application.properties```
2. 將 ```Attendance-System-frontend/extra-file/FileStorageImpl.java``` 放入
   ```src/main/java/com/tsmc/cloudnative/attendancesystemapi/service/```
3. 再次嘗試輸入指令

## application.properties 變更

在文件最後加入了兩個屬性以迴避執行錯誤

```telegram.bot.token=${TELEGRAM_BOT_TOKEN:dummyTokenForDev}``` ```jwt.secret=ThisIsASecretKeyThatIsLongEnoughToBeSecure1234```


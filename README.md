# Vet App Frontend

Bu proje, bir veteriner kliniğinin işlerini yönetebilmesi için geliştirilen bir web uygulamasının ön uç kısmını içerir. Aşağıda projenin temel özellikleri ve kullanılan teknolojiler özetlenmiştir.

## Projeyi [Linkten](https://vet-app-ilkyaz.netlify.app/) İnceliyebilirsiniz 



## Temel Özellikler:

- Hayvanların ve sahiplerinin yönetimi
- Uygulanan aşıların yönetimi
- Randevu yönetimi
- Veteriner doktor yönetimi
- Doktorlar ve müsait günlerinin yönetimi
- Rapor yönetimi

## Kullanılan Teknolojiler:

- [Vite](https://vitejs.dev/): Hızlı, modern ve gelişmiş bir ön uç geliştirme aracı
- [React](https://reactjs.org/): JavaScript kütüphanesi, kullanıcı arayüzü oluşturmak için kullanılır
- [React Router](https://reactrouter.com/): React uygulamalarında gezintiyi yönetmek için kullanılan bir kütüphane
- [Axios](https://axios-http.com/): HTTP istekleri yapmak ve yanıtları işlemek için kullanılan bir kütüphane

## Kurulum ve Kullanım:

1. Projeyi klonlayın:

   ```bash
   git clone https://github.com/yasinilkyaz/vet-app

2. Proje dizinine gidin:

    ```bash
    cd vet-app
3. Bağımlılıkları yükleyin:

    ```bash
    npm install

4. Uygulamayı backend ile birlikte localde çalıştırmak istiyorsanız. Backend repository ziyaret edin.

    
    ## [Vet-Application](https://github.com/yasinilkyaz/Vet-Application)

5. Diğer bir seçenek olarak çalışan web servise istek atmak için .env dosyanızı şu şekilde güncelleyin.

    ```bash
    VITE_APP_BASE_URL = https://vet-application.onrender.com

6. Uygulamayı başlatın:

    ```bash
    npm run dev
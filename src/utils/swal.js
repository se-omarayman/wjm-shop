// sweet alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const swalWarning = withReactContent(
    Swal.mixin({
        allowEscapeKey: () => !Swal.isLoading(),
        allowOutsideClick: () => !Swal.isLoading(),
        // buttonsStyling: false,
        // customClass: {
        //     confirmButton: 'btn btn-warning btn-lg mx-1',
        //     cancelButton: 'btn btn-default btn-lg mx-1',
        //     actions: 'text-center',
        // },
    })
);

const swalDanger = withReactContent(
    Swal.mixin({
        allowEscapeKey: () => !Swal.isLoading(),
        allowOutsideClick: () => !Swal.isLoading(),
        // buttonsStyling: false,
        // customClass: {
        //     confirmButton: 'btn btn-danger btn-lg mx-1',
        //     cancelButton: 'btn btn-default btn-lg mx-1',
        //     actions: 'text-center',
        // },
    })
);

const swalSuccess = withReactContent(
    Swal.mixin({
        // buttonsStyling: false,
        // customClass: {
        //     confirmButton: 'btn btn-primary btn-lg',
        //     actions: 'text-center',
        // },
    })
);

const swalError = withReactContent(
    Swal.mixin({
        // buttonsStyling: false,
        // customClass: {
        //     confirmButton: 'btn btn-primary btn-lg',
        //     actions: 'text-center',
        // },
    })
);

const swalSuccessToast = withReactContent(
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    })
);

export { swalWarning, swalDanger, swalSuccess, swalError, swalSuccessToast };

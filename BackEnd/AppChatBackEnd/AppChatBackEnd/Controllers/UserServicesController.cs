using AppChat.Data;
using AppChat.DTO.Request;
using AppChat.DTO.Response;
using AppChat.Models.Entities;
using AppChatBackEnd.DTO.Request;

using AppChatBackEnd.DTO.Request.ChatRequest;

using AppChatBackEnd.Models.Entities;
using AppChatBackEnd.Services.imp;
using AppChatBackEnd.Services.template;
using AppChatBackEnd.utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppChatBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserServicesController : ControllerBase
    {
        private DataContext _dataContext;
        private IMailService mailService;
        private ISendDataLogin sendDataLogin;
        public UserServicesController(DataContext DataContext, IMailService mailService, ISendDataLogin sendDataLogin)
        {
            _dataContext = DataContext;
            this.mailService = mailService;
            this.sendDataLogin = sendDataLogin;
        }
        [HttpPost("register")]
        public async Task<IActionResult>  Register(CreateUserRequestDTO registerDto)
        {
            var userTemp = _dataContext.Users
            .Include(u => u.UserDetail)
            .SingleOrDefault(u => u.Email == registerDto.Email);
            if (!(userTemp == null))
            {
                if(userTemp.UserDetail.Verified == 1)
                {
                    return BadRequest("Email này đã được sử dụng");
                } else
                {
                    String otpCodeForAccountDontVerified = MyUtil.CreateCodeVerify();
                    userTemp.UserDetail.Otp =otpCodeForAccountDontVerified;
                    await mailService.SendCodeEmailAsync(userTemp.Email, otpCodeForAccountDontVerified);
                    userTemp.UserDetail.OtpExpiryTime = DateTime.Now.AddMinutes(30);
                    _dataContext.SaveChanges();
                    return Ok(new MessageResponseDTO("Đăng ký tài khoản thành công ! Vui lòng xác minh tài khoản")
                   );
                }
               
            }
            String otpCode = MyUtil.CreateCodeVerify();
            UserDetails userDetails = new UserDetails
            {

                 Verified = 0,
                 Otp = otpCode,
                 OtpExpiryTime = DateTime.Now.AddMinutes(30),
            };
           

            var user = new Users
            {
                UserName = registerDto.UserName,
                Password = registerDto.Password, 
                Email = registerDto.Email,
                RoleId = 2, // Default role is "user"
                Img = "",
                UserDetail = userDetails
            };
            user.Password = MyUtil._passwordHasher.HashPassword(user,registerDto.Password);
            try
            {
                await mailService.SendCodeEmailAsync(registerDto.Email, otpCode);

                _dataContext.Add(userDetails);
                _dataContext.Add(user);
                _dataContext.SaveChanges();

                return Ok(new MessageResponseDTO("Đăng ký tài khoản thành công ! Vui lòng xác minh tài khoản"));
            }
            catch (Exception ex) {
                return StatusCode(500, $"Đã xảy ra lỗi khi đăng ký người dùng: {ex.InnerException.Message}");
                
                  
               

          }
            
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDTO loginRequestDTO)
        {
            var user = _dataContext.Users
            .Include(u => u.UserDetail)
            .Include(u => u.Role)
            .SingleOrDefault(u => u.Email.Equals(loginRequestDTO.Email));

            if (user == null)
            {
                return Ok(new MessageResponseDTO("Tài khoản này chưa đăng ký hệ thống. Vui lòng nhập lại tài khoản email."));
            }
            else
            {
                var resultEqualEncodePass = MyUtil._passwordHasher.VerifyHashedPassword(user, user.Password, loginRequestDTO.Password);
                if (resultEqualEncodePass == PasswordVerificationResult.Success)
                {
                    if (user.UserDetail.Verified == 1)
                    {
                        var result = await sendDataLogin.sendDataLogin(user);
                        return Ok(result);



                   }
                    else
                    {
                        return Ok(new MessageResponseDTO("Tài khoản này chưa được xác minh. Xin vui lòng đăng ký lại để xác minh"));
                    }
                } else
                {
                    return Ok(new MessageResponseDTO("Tài khoản hoặc mật khẩu không chính xác. Xin vui lòng nhập lại"));
                }
            }
            
                
            

        }

        [HttpPost("verifyAccount")]
        public IActionResult VerifyAccount(string email, string otp)
        {
            var user = _dataContext.Users
                .Include(u => u.UserDetail)
                .FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                return Ok(new MessageResponseDTO("Hệ thống không tìm thấy email này, đảm bảo bạn đã nhập đúng email đăng ký"));
            }

            if (user.UserDetail.Verified == 1)
            {
                return Ok(new MessageResponseDTO("Tài khoản này đã được xác minh!"));
            }

            if (user.UserDetail.Otp != otp)
            {
                return Ok(new MessageResponseDTO("Mã xác thực không đúng. Vui lòng nhập lại."));
            }

            if (user.UserDetail.OtpExpiryTime <= DateTime.Now)
            {
                return Ok(new MessageResponseDTO("Thời gian mã xác thực đã quá 30 phút. Vui lòng đăng ký lại tài khoản."));
            }

            // Xác thực tài khoản thành công
            user.UserDetail.Verified = 1;

            try
            {
                _dataContext.SaveChanges();
                return Ok(new MessageResponseDTO("Tài khoản xác thực thành công."));
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ (ghi log, v.v.)
                return StatusCode(500, "Đã xảy ra lỗi khi xác thực tài khoản. Vui lòng thử lại sau.");
            }
        }
        [HttpPost("ForgotPassword")]
        public async Task< IActionResult> ForgotPassword(string email)
        {
            var user = _dataContext.Users
                .Include(u => u.UserDetail)
                .FirstOrDefault(u => u.Email == email);
            if (user == null) {
                return Ok(new MessageResponseDTO("Email này không đăng ký trên hệ thống. Vui lòng nhập lại email của bạn"));
            
            }
            else
            {
                String newPassword = await mailService.SendCodeForForgotPassword(email);
                 user.Password = MyUtil._passwordHasher.HashPassword(user, newPassword);
                _dataContext.SaveChangesAsync();
                return Ok(new MessageResponseDTO("Hệ thống đã gửi mật khẩu mới vào email của bạn. Vui lòng kiểm tra thư của bạn"));
                
            }
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequestDTO changePasswordRequest)
        {
            var user = _dataContext.Users
              .Include(u => u.UserDetail)
              .FirstOrDefault(u => u.UserId == changePasswordRequest.IdUser);
            var resultEqualEncodePass = MyUtil._passwordHasher.VerifyHashedPassword(user, user.Password, changePasswordRequest.Password);
            if (resultEqualEncodePass == PasswordVerificationResult.Success)
            {
                if (changePasswordRequest.NewPassword.Equals(changePasswordRequest.ReTypePassword)) {
                    user.Password = MyUtil._passwordHasher.HashPassword(user, changePasswordRequest.NewPassword);
                    _dataContext.SaveChangesAsync();
                    return Ok(new MessageResponseDTO("Đổi mật khẩu thành công"));

                }
                else
                {
                    return Ok(new MessageResponseDTO("Mật khẩu mới và mật khẩu nhập lại của bạn không khớp với nhau. Vui lòng nhập lại"));
                }

            }
            else
            {
                return Ok(new MessageResponseDTO("Mật khẩu hiện tại của bạn nhập không đúng. Vui lòng nhập lại"));
            }


        }



    }
}

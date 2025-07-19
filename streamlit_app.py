import streamlit as st
import google.generativeai as genai
from datetime import datetime
import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfutils
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

# 페이지 설정
st.set_page_config(
    page_title="엘비즈파트너스 - AI 서류 생성기",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 제목
st.title("🏢 엘비즈파트너스")
st.subheader("📄 AI 서류 자동 생성 시스템")
st.markdown("---")

# 사이드바 - API 키 설정
with st.sidebar:
    st.header("🔑 API 설정")
    api_key = st.text_input(
        "Google Gemini API 키",
        type="password",
        help="https://aistudio.google.com/app/apikey 에서 발급받으세요"
    )
    
    if api_key:
        st.success("✅ API 키가 설정되었습니다!")
        genai.configure(api_key=api_key)
    else:
        st.warning("⚠️ API 키를 입력해주세요")

# 메인 컨텐츠
col1, col2, col3 = st.columns([1, 1, 1])

# 첫 번째 컬럼 - 회사 정보
with col1:
    st.header("🏢 회사 정보")
    
    company_name = st.text_input("회사명 *", value="엘비즈파트너스")
    ceo_name = st.text_input("대표자 *", value="김대표")
    business_number = st.text_input("사업자등록번호", value="123-45-67890")
    company_address = st.text_input("회사 주소", value="서울시 강남구 테헤란로 123")
    company_phone = st.text_input("회사 전화번호", value="02-1234-5678")
    company_email = st.text_input("회사 이메일", value="info@lbizpartners.com")

# 두 번째 컬럼 - 직원 정보
with col2:
    st.header("👤 직원 정보")
    
    employee_name = st.text_input("성명 *", value="홍길동")
    employee_id = st.text_input("사번 *", value="EMP001")
    department = st.text_input("부서", value="개발팀")
    position = st.text_input("직급", value="주임")
    hire_date = st.date_input("입사일")
    birth_date = st.date_input("생년월일")
    salary = st.number_input("기본급 (원)", min_value=0, value=3500000, step=50000)
    employment_type = st.selectbox("고용형태", ["정규직", "계약직", "시간제"])
    employee_phone = st.text_input("전화번호", value="010-1234-5678")
    employee_email = st.text_input("이메일", value="hong@test.com")

# 세 번째 컬럼 - 서류 생성
with col3:
    st.header("📝 서류 생성")
    
    # 서류 종류 선택
    document_types = [
        "근로계약서", "재직증명서", "경력증명서", "급여명세서", 
        "퇴직증명서", "사직서", "휴직신청서", "복직신청서",
        "출장신청서", "휴가신청서", "연장근무신청서", "교육신청서",
        "인사발령서", "승진발령서", "전근발령서", "기타"
    ]
    
    selected_document = st.selectbox("생성할 서류 선택 *", [""] + document_types)
    
    # 기타 선택 시 직접 입력
    if selected_document == "기타":
        custom_document = st.text_input("서류명 직접 입력", placeholder="예: 업무협약서, 위임장 등")
        document_type = custom_document if custom_document else selected_document
    else:
        document_type = selected_document
    
    # 추가 요청사항
    additional_notes = st.text_area(
        "추가 요청사항", 
        placeholder="특별히 포함하고 싶은 내용이나 조건을 입력하세요"
    )

# 서류 생성 버튼
st.markdown("---")

if st.button("🚀 AI로 서류 생성", type="primary", use_container_width=True):
    # 필수 필드 검증
    if not api_key:
        st.error("❌ Google Gemini API 키를 먼저 입력해주세요!")
    elif not company_name or not ceo_name or not employee_name or not employee_id:
        st.error("❌ 필수 항목을 모두 입력해주세요! (회사명, 대표자, 성명, 사번)")
    elif not document_type:
        st.error("❌ 생성할 서류를 선택해주세요!")
    else:
        with st.spinner("🤖 AI가 서류를 생성하고 있습니다..."):
            try:
                # Gemini 모델 설정
                model = genai.GenerativeModel('gemini-pro')
                
                # 프롬프트 생성
                prompt = f"""
당신은 한국의 인사 담당자입니다. 다음 정보를 바탕으로 {document_type}를 작성해주세요.

**회사 정보:**
- 회사명: {company_name}
- 대표자: {ceo_name}
- 사업자등록번호: {business_number}
- 주소: {company_address}
- 전화번호: {company_phone}
- 이메일: {company_email}

**직원 정보:**
- 성명: {employee_name}
- 사번: {employee_id}
- 부서: {department}
- 직급: {position}
- 입사일: {hire_date}
- 생년월일: {birth_date}
- 기본급: {salary:,}원
- 고용형태: {employment_type}
- 전화번호: {employee_phone}
- 이메일: {employee_email}

**추가 요청사항:**
{additional_notes if additional_notes else '없음'}

**작성 가이드라인:**
1. 한국의 고용노동부 표준 양식에 맞춰 작성
2. 법적으로 유효한 형식으로 작성
3. 정중하고 공식적인 문체 사용
4. 현재 날짜는 {datetime.now().strftime('%Y년 %m월 %d일')}
5. 회사 직인 위치를 명시 ([직인] 표시)
6. HTML 형식으로 출력하되, 깔끔하고 인쇄하기 좋은 레이아웃 사용

서류를 HTML 형식으로 작성해주세요.
"""
                
                # AI 응답 생성
                response = model.generate_content(prompt)
                generated_content = response.text
                
                st.success(f"✅ {document_type} 생성이 완료되었습니다!")
                
                # 생성된 서류 표시
                st.markdown("### 📄 생성된 서류")
                st.markdown(generated_content, unsafe_allow_html=True)
                
                # 다운로드 버튼들
                st.markdown("---")
                st.markdown("### 💾 다운로드")
                
                col_download1, col_download2 = st.columns(2)
                
                with col_download1:
                    # HTML 다운로드
                    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{document_type} - {employee_name}</title>
    <style>
        body {{ font-family: 'Malgun Gothic', sans-serif; margin: 40px; line-height: 1.6; }}
        .header {{ text-align: center; margin-bottom: 30px; }}
        .content {{ max-width: 800px; margin: 0 auto; }}
        .signature {{ margin-top: 50px; text-align: right; }}
        @media print {{ body {{ margin: 20px; }} }}
    </style>
</head>
<body>
    <div class="content">
        {generated_content}
    </div>
</body>
</html>
"""
                    st.download_button(
                        label="📄 HTML 파일 다운로드",
                        data=html_content,
                        file_name=f"{document_type}_{employee_name}_{datetime.now().strftime('%Y%m%d')}.html",
                        mime="text/html"
                    )
                
                with col_download2:
                    # 텍스트 다운로드
                    # HTML 태그 제거
                    import re
                    text_content = re.sub('<[^<]+?>', '', generated_content)
                    text_content = text_content.replace('&nbsp;', ' ').replace('&lt;', '<').replace('&gt;', '>')
                    
                    st.download_button(
                        label="📝 텍스트 파일 다운로드", 
                        data=text_content,
                        file_name=f"{document_type}_{employee_name}_{datetime.now().strftime('%Y%m%d')}.txt",
                        mime="text/plain"
                    )
                
            except Exception as e:
                st.error(f"❌ 서류 생성 중 오류가 발생했습니다: {str(e)}")
                st.info("💡 API 키가 올바른지 확인하고 다시 시도해주세요.")

# 푸터
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: gray; font-size: 12px;'>
        © 2024 엘비즈파트너스. 모든 권리 보유. | 
        <a href='https://aistudio.google.com/app/apikey' target='_blank'>Gemini API 키 발급</a>
    </div>
    """, 
    unsafe_allow_html=True
)
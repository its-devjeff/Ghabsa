import { useRef } from "react";
import { useState } from "react";
import PageShell from "../../Components/PageShell/PageShell";
import './Faqs.css'
/* Answers are drawn from published sources: the University of Ghana programme
   page and International Programmes Office listing, the UG admissions entry
   requirements, the department's 50th anniversary record, WACCBIP, and the
   GHABSA-UG Editorial Society site. Anything the association has not published
   (membership dues, this year's cut-off aggregate, fixture dates) is pointed at
   a person to ask rather than guessed at here. */
const faqs = [
    {
        id: 1,
        header: "What programmes does the department offer?",
        text: `The Department of Biochemistry, Cell and Molecular Biology offers a BSc in Biochemistry, Cell and Molecular Biology as a single major, and a BSc in Biochemistry combined with a second subject, such as Nutrition. Both sit in the School of Biological Sciences, College of Basic and Applied Sciences, and run for four years.`
    },
    {
        id: 2,
        header: "What is biochemistry, cell and molecular biology actually about?",
        text: `It is the study of the chemical and physical principles behind biological processes: how cells develop, and how genetic information is stored and passed on. The programme draws on Biology, Chemistry, Physics, Mathematics, Genetics and Molecular Biology. Basic research asks how cells develop, grow and inherit; applied research turns that into things people use, from disease detection and drug discovery to biofuels and genetically engineered crops.`
    },
    {
        id: 3,
        header: "What are the entry requirements?",
        text: `WASSCE or SSSCE applicants need credit passes in the core subjects, including English, Core Mathematics and Integrated Science, together with electives in Biology and Chemistry plus one of Physics or Elective Mathematics. The aggregate needed changes from year to year and is set by the University, not by the department, so check the current figure on the University of Ghana admissions site before you apply.`
    },
    {
        id: 4,
        header: "How is the programme structured across the levels?",
        text: `Teaching runs across Levels 100 to 400, with the biochemistry core building through Levels 200, 300 and 400. Courses move from the structures and functions of biomolecules in the earlier levels through to applied ground such as clinical biochemistry later on. Research is part of the curriculum rather than an add-on at the end.`
    },
    {
        id: 5,
        header: "What can I do with the degree afterwards?",
        text: `Graduates go into research in universities, research institutes and industry, particularly pharmaceuticals, and into health, food and agriculture, and the environment. The degree is also a route into graduate entry medicine, dentistry and veterinary science. A Masters or PhD is normally expected for a research career, and a PhD is essential for academic research or lecturing. Plenty of graduates also move into management, business and finance.`
    },
    {
        id: 6,
        header: "What is GHABSA and am I already a member?",
        text: `GHABSA is the Ghana Biochemistry Students' Association. It has chapters at several universities, and GHABSA-UG is the University of Ghana chapter. If you are a biochemistry student here, this is your association. For anything about dues or formal registration, speak to the Financial Secretary or email the association directly.`
    },
    {
        id: 7,
        header: "What does GHABSA actually run during the year?",
        text: `Four things recur. GHABSA Games is an inter-level competition for the trophy, including soccer, athletics and volleyball. Prepcon is an inter-hall quiz across all levels, run before examinations to get people revising early, and has been going since 2017. Meet the Family is the forum where the student body sits down with the faculty to raise issues. The GHABSA Annual Congress brings biochemistry students from five universities together in one place, hosted by a different one each year.`
    },
    {
        id: 8,
        header: "Which universities take part in the Annual Congress?",
        text: `Five. The University of Ghana in Accra, the University of Cape Coast, Kwame Nkrumah University of Science and Technology in Kumasi, the University of Health and Allied Sciences in Ho, and the University for Development Studies in Tamale. The hosting duty rotates every year.`
    },
    {
        id: 9,
        header: "How old is the department?",
        text: `The department dates back to 1964 and was part of the Department of Nutrition and Food Science until 1970. It marked its 50th anniversary in 2014.`
    },
    {
        id: 10,
        header: "Is there research I can get involved in?",
        text: `The department hosts the West African Centre for Cell Biology of Infectious Pathogens, one of the World Bank's African Centres of Excellence, led by faculty from this department together with the Noguchi Memorial Institute for Medical Research. It runs Masters, PhD and postdoctoral training and short courses in cell and molecular biology, and researches the biology of tropical diseases. Ask your lecturers about openings.`
    },
    {
        id: 11,
        header: "How do I get in touch?",
        text: `Email the association at ug.ghabsa@gmail.com, or find us as @ghabsa_ug on Instagram and X. For University and departmental matters, the University of Ghana can be reached on +233 (0)302 213850, at pad@ug.edu.gh, or by post at P.O. Box LG 25, Legon, Accra. There is also a contact form on this site.`
    }
]

const AccordionItem = (props) => {
    const contentEl = useRef();
    const { handleToggle, active, faq } = props;
    const { header, id, text } = faq;

    return (
        <div className="rc-accordion-card">
            <div className="rc-accordion-header">
                <div className={`rc-accordion-toggle p-3 ${active === id ? 'active' : ''}`} onClick={() => handleToggle(id)}>
                    <h5 className="rc-accordion-title">{header}</h5>
                    <i className="fa fa-chevron-down rc-accordion-icon"></i>
                </div>
            </div>
            <div ref={contentEl} className={`rc-collapse ${active === id ? 'show' : ''}`} style={
                active === id
                    ? { height: contentEl.current.scrollHeight }
                    : { height: "0px" }
            }>
                <div className="rc-accordion-body">
                    {/* Answers are authored with <br> in the string, which React
                        escapes. Split on it and render real line breaks. */}
                    <p className='mb-0'>
                        {text.split(/<br\s*\/?>/i).map((line, i, all) => (
                            <span key={i}>
                                {line.trim()}
                                {i < all.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    )
}

const FAQs = () => {
    
    const [active, setActive] = useState(null);

    const handleToggle = (index) => {
        if (active === index) {
            setActive(null);
        } else {
            setActive(index);
        }
    }
    
    return (
        <PageShell
            title='Frequently asked questions'
            intro='The questions students ask most often about the department and the association.'
        >
            <div className="Faqs container-fluid mt-5 mb-5">
                <div className="card-row justify-content-center">
                    <div className="col-md-8 mt-2">
                        <div className="course-card">
                            <div className="course-card-body">
                                                {faqs.map((faq, index) => {
                                     return (
                                            <AccordionItem key={index} active={active} handleToggle={handleToggle} faq={faq} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default FAQs;
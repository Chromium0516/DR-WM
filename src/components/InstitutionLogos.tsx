import deepRobotics from "@/assets/institutions/deep-robotics-header.png";
import zhejiangUniversity from "@/assets/institutions/zhejiang-university.png";
import mit from "@/assets/institutions/mit.svg";
import bit from "@/assets/institutions/beijing-institute-of-technology.svg";

const institutions = [
  { id: "deep-robotics", name: "DEEP Robotics", url: "https://www.deeprobotics.cn/en/", logo: deepRobotics, width: 519, height: 160 },
  { id: "zju", name: "Zhejiang University", url: "https://www.zju.edu.cn/english/", logo: zhejiangUniversity, width: 318, height: 253 },
  { id: "mit", name: "Massachusetts Institute of Technology (MIT)", url: "https://www.mit.edu/", logo: mit, width: 378, height: 200 },
  { id: "bit", name: "Beijing Institute of Technology (BIT)", url: "https://www.bit.edu.cn/", logo: bit, width: 288, height: 288 },
];

export function InstitutionLogos() {
  return (
    <nav aria-label="Institutions" className="institution-strip">
      <ul className="institution-logos">
        {institutions.map((institution) => (
          <li key={institution.id}>
            <a href={institution.url} className={`institution-logo institution-logo-${institution.id}`} target="_blank" rel="noopener noreferrer">
              <img src={institution.logo} alt={institution.name} width={institution.width} height={institution.height} decoding="async" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

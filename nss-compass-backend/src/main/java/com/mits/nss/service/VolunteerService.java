package com.mits.nss.service;

import com.mits.nss.dto.VolunteerDto;
import com.mits.nss.entity.Volunteer;
import com.mits.nss.exception.BadRequestException;
import com.mits.nss.exception.ResourceNotFoundException;
import com.mits.nss.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerRepository repository;

    @Transactional(readOnly = true)
    public Page<VolunteerDto> search(String query, String department, Integer year,
                                      String sortKey, String sortDir, int page, int size) {
        Specification<Volunteer> spec = Specification.where(null);

        if (StringUtils.hasText(query)) {
            String like = "%" + query.trim().toLowerCase() + "%";
            spec = spec.and((root, cq, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("rollNo")), like),
                    cb.like(root.get("phone"), like)
            ));
        }
        if (StringUtils.hasText(department) && !department.equalsIgnoreCase("all")) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("department"), department));
        }
        if (year != null) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("year"), year));
        }

        String sortProperty = switch (sortKey == null ? "name" : sortKey) {
            case "rollNo", "name", "department", "year", "hours" -> sortKey;
            default -> "name";
        };
        Sort sort = Sort.by(sortProperty);
        sort = "desc".equalsIgnoreCase(sortDir) ? sort.descending() : sort.ascending();

        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, sort);
        return repository.findAll(spec, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public VolunteerDto getById(Long id) {
        return toDto(findEntity(id));
    }

    @Transactional(readOnly = true)
    public Volunteer findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with id " + id));
    }

    @Transactional(readOnly = true)
    public VolunteerDto getByRollNo(String rollNo) {
        Volunteer v = repository.findByRollNoIgnoreCase(rollNo)
                .orElseThrow(() -> new ResourceNotFoundException("No volunteer found with roll number " + rollNo));
        return toDto(v);
    }

    @Transactional
    public VolunteerDto create(VolunteerDto dto) {
        if (repository.existsByRollNoIgnoreCase(dto.getRollNo())) {
            throw new BadRequestException("A volunteer with roll number " + dto.getRollNo() + " already exists");
        }
        Volunteer entity = toEntity(dto);
        entity.setId(null);
        if (entity.getHours() == null) entity.setHours(0);
        if (entity.getStatus() == null) entity.setStatus("Active");
        return toDto(repository.save(entity));
    }

    @Transactional
    public VolunteerDto update(Long id, VolunteerDto dto) {
        Volunteer entity = findEntity(id);
        entity.setRollNo(dto.getRollNo());
        entity.setName(dto.getName());
        entity.setDepartment(dto.getDepartment());
        entity.setYear(dto.getYear());
        entity.setPhone(dto.getPhone());
        entity.setGender(dto.getGender());
        entity.setEmail(dto.getEmail());
        entity.setBloodGroup(dto.getBloodGroup());
        entity.setAddress(dto.getAddress());
        entity.setHours(dto.getHours() == null ? entity.getHours() : dto.getHours());
        entity.setStatus(dto.getStatus() == null ? entity.getStatus() : dto.getStatus());
        return toDto(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Volunteer not found with id " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Volunteer> findAllEntities() {
        return repository.findAll();
    }

    public VolunteerDto toDto(Volunteer v) {
        return VolunteerDto.builder()
                .id(v.getId())
                .rollNo(v.getRollNo())
                .name(v.getName())
                .department(v.getDepartment())
                .year(v.getYear())
                .phone(v.getPhone())
                .gender(v.getGender())
                .email(v.getEmail())
                .bloodGroup(v.getBloodGroup())
                .address(v.getAddress())
                .hours(v.getHours())
                .status(v.getStatus())
                .build();
    }

    private Volunteer toEntity(VolunteerDto dto) {
        return Volunteer.builder()
                .id(dto.getId())
                .rollNo(dto.getRollNo())
                .name(dto.getName())
                .department(dto.getDepartment())
                .year(dto.getYear())
                .phone(dto.getPhone())
                .gender(dto.getGender())
                .email(dto.getEmail())
                .bloodGroup(dto.getBloodGroup())
                .address(dto.getAddress())
                .hours(dto.getHours())
                .status(dto.getStatus())
                .build();
    }
}

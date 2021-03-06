/*
 * Copyright 2012 Shared Learning Collaborative, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


package org.slc.sli.api.client.impl;

import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.slc.sli.api.client.Entity;
import org.slc.sli.api.client.Link;
import org.slc.sli.api.client.impl.transform.GenericEntityDeserializer;
import org.slc.sli.api.client.impl.transform.GenericEntitySerializer;

/**
 * Generic implementation of the Entity interface. This is implements the Entity interface
 * in the most generic way possible.
 * 
 * @author asaarela
 */
@JsonSerialize(using = GenericEntitySerializer.class, include = JsonSerialize.Inclusion.NON_NULL)
@JsonDeserialize(using = GenericEntityDeserializer.class)
public class GenericEntity implements Entity {
    
    private final String type;
    
    private final Map<String, Object> data;
    
    /**
     * Construct a new generic entity.
     * 
     * @param type
     *            Entity type for this entity.
     * @param body
     *            Map representing the entity's data.
     * @param metadata
     *            Map representing the entity's metadata.
     */
    public GenericEntity(final String type, final Map<String, Object> data) {
        this.type = type;
        this.data = data;
    }
    
    @Override
    public String getId() {
        if (data.containsKey(ENTITY_ID_KEY)) {
            return (String) data.get(ENTITY_ID_KEY);
        }
        return null;
    }
    
    @Override
    public Map<String, Object> getData() {
        return data;
    }
    
    @SuppressWarnings("unchecked")
    @Override
    public List<Link> getLinks() {
        
        if (data.containsKey(LINKS_KEY)) {
            return (List<Link>) data.get(LINKS_KEY);
        }
        return null;
    }
    
    @Override
    public String getEntityType() {
        return type;
    }
}
